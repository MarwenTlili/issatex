<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Symfony\Component\HttpFoundation\Response;

class TokensTest extends ApiTestCase {
    private const AUTH_URL = '/api/token/login';
    private const TOKEN_REFRESH = '/api/token/refresh';
    private const TOKEN_INVALIDATE = '/api/token/invalidate';

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

        $token = $authResponse['token'];
        $refresh_token = $authResponse['refresh_token'];

        // Test access with valid token
        $this->assertAuthorizedAccess($client, $token);

        // Refresh token
        $refreshResponse = $this->refresh_token($client, $refresh_token);
        $this->assertValidAuthResponse($refreshResponse);
        /**
         * check/remove this if "single_use: true"
         * in config/packages/gesdinet_jwt_refresh_token.yaml
         */
        $this->assertEquals($refreshResponse['refresh_token'], $refresh_token);

        // Test access with refreshed token
        $this->assertAuthorizedAccess($client, $refreshResponse['token']);

        // Invalidate refresh token
        $this->invalidateToken($client, $refresh_token);

        // Ensure invalidated refresh token cannot be used again
        $client->request('GET', self::TOKEN_REFRESH, [
            'json' => ['refresh_token' => $refresh_token]
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertJsonContains(['message' => 'JWT Refresh Token Not Found']);
    }

    private function authenticate($client, string $username, string $password): array {
        $response = $client->request('POST', self::AUTH_URL, [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => ['username' => $username, 'password' => $password]
        ]);

        $this->assertResponseIsSuccessful();
        return $response->toArray();
    }

    private function refresh_token($client, string $refresh_token): array {
        $response = $client->request('POST', self::TOKEN_REFRESH, [
            'json' => ['refresh_token' => $refresh_token]
        ]);

        $this->assertResponseIsSuccessful();
        return $response->toArray();
    }

    private function invalidateToken($client, string $refresh_token): void {
        $client->request('POST', self::TOKEN_INVALIDATE, [
            'json' => ['refresh_token' => $refresh_token]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains(['message' => 'The supplied refresh_token has been invalidated.']);
    }

    private function assertAuthorizedAccess($client, string $token): void {
        $client->request('GET', '/api/users', ['auth_bearer' => $token]);

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
        $this->assertArrayHasKey('token', $response);
        $this->assertArrayHasKey('refresh_token', $response);
    }
}
