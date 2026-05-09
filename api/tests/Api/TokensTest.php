<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use Symfony\Component\HttpFoundation\Response;

class TokensTest extends ApiTestCase {
    private const AUTH_URL = '/api/token/login';
    private const TOKEN_REFRESH = '/api/token/refresh';
    private const TOKEN_INVALIDATE = '/api/token/invalidate';
    private const IS_REFRESH_TOKEN_SINGLE_USE = false;

    private const IDENTIFIER = 'admin';
    private const PASSWORD = 'admin';

    public function testTokenWorkflow() {
        $client = self::createClient();

        // Test unauthorized access
        $client->request('GET', '/api/users');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        // Authenticate and retrieve tokens
        $authResponse = $this->authenticate($client, self::IDENTIFIER, self::PASSWORD);
        $this->assertValidAuthResponse($authResponse);

        $access_token = $authResponse['access_token'];
        $refresh_token = $authResponse['refresh_token'];

        // Test access with valid token
        $this->assertAuthorizedAccess($client, $access_token);

        // Refresh token
        $refreshResponse = $this->requestRefreshToken($client, $refresh_token);
        $this->assertValidAuthResponse($refreshResponse);
        /**
         * check/remove this if "single_use: true"
         * in config/packages/gesdinet_jwt_refresh_token.yaml
         */
        self::IS_REFRESH_TOKEN_SINGLE_USE ?
            $this->assertNotEquals($refreshResponse['refresh_token'], $refresh_token)
            :
            $this->assertEquals($refreshResponse['refresh_token'], $refresh_token);

        // Test access with refreshed token
        $this->assertAuthorizedAccess($client, $refreshResponse['access_token']);

        // Invalidate refresh token
        $this->invalidateRefreshToken($client, $refresh_token);

        // Ensure invalidated refresh token cannot be used again
        $client->request('GET', self::TOKEN_REFRESH, [
            'json' => ['refresh_token' => $refresh_token]
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertJsonContains(['message' => 'JWT Refresh Token Not Found']);
    }

    private function authenticate(Client $client, string $username, string $password): array {
        $response = $client->request('POST', self::AUTH_URL, [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => ['username' => $username, 'password' => $password]
        ]);

        $this->assertResponseIsSuccessful();
        return $response->toArray();
    }

    private function requestRefreshToken(Client $client, string $refresh_token): array {
        $response = $client->request('POST', self::TOKEN_REFRESH, [
            'json' => ['refresh_token' => $refresh_token]
        ]);

        $this->assertResponseIsSuccessful();
        return $response->toArray();
    }

    private function invalidateRefreshToken(Client $client, string $refresh_token): void {
        $client->request('POST', self::TOKEN_INVALIDATE, [
            'json' => ['refresh_token' => $refresh_token]
        ]);

        $this->assertResponseIsSuccessful();
        self::IS_REFRESH_TOKEN_SINGLE_USE ?
            $this->assertJsonContains(['message' => 'The supplied refresh_token is already invalid.'])
            :
            $this->assertJsonContains(['message' => 'The supplied refresh_token has been invalidated.']);
    }

    private function assertAuthorizedAccess(Client $client, string $access_token): void {
        $client->request('GET', '/api/users', ['auth_bearer' => $access_token]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/api/users',
            '@type' => 'Collection',
            'totalItems' => 4
        ]);
    }

    private function assertValidAuthResponse(array $response): void {
        $this->assertArrayHasKey('access_token', $response);
        $this->assertArrayHasKey('refresh_token', $response);
    }
}
