<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

class WithoutOrdreFabricationFilter extends AbstractFilter {
  protected function filterProperty(
    string $property,
    $value,
    QueryBuilder $queryBuilder,
    QueryNameGeneratorInterface $queryNameGenerator,
    string $resourceClass,
    ?Operation $operation = null,
    array $context = []
  ): void {
    if ($property === 'withoutOrdreFabrication' & $value === 'true') {
      $alias = $queryBuilder->getRootAliases()[0];
      $currentId = $context['filters']['currentArticle'] ?? null;

      $queryBuilder
        ->leftJoin(sprintf('%s.ordreFabrications', $alias), 'of');

      if ($currentId) {
        $queryBuilder
          ->andWhere('of.id IS NULL OR ' . $alias . '.id = :currentId')
          ->setParameter('currentId', $currentId);
      } else {
        $queryBuilder
          ->andWhere('of.id IS NULL');
      }
    }
  }

  public function getDescription(string $resourceClass): array {
    return [
      'withoutOrdreFabrication' => [
        'property' => 'withoutOrdreFabrication',
        'type' => Type::BUILTIN_TYPE_BOOL,
        'required' => false,
        'swagger' => [
          'description' => 'Filter articles without ordreFabrication',
          'name' => 'withoutOrdreFabrication',
          'type' => 'boolean',
        ],
      ],
      'currentArticle' => [
        'property' => 'currentArticle',
        'type' => Type::BUILTIN_TYPE_INT,
        'required' => false,
        'openapi' => [
          'description' => 'Include the given article ID even if it already has an ordreFabrication (useful in edit forms).',
          'name' => 'currentArticle',
          'type' => 'integer',
        ],
      ],
    ];
  }
}
