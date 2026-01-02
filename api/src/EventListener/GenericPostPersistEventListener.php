<?php

namespace App\EventListener;

use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::postPersist)]
class GenericPostPersistEventListener {
    private array $prefixes;

    public function __construct(array $prefixes) {
        $this->prefixes = $prefixes;
    }

    public function postPersist(PostPersistEventArgs $args) {
        $entity = $args->getObject();
        $entityClass = get_class($entity);

        // Check if the entity is configured for setting a ref
        if (!isset($this->prefixes[$entityClass]) || !method_exists($entity, 'getRef') || !method_exists($entity, 'setRef')) {
            return;
        }

        if (!$entity->getRef()) {
            $prefix = $this->prefixes[$entityClass];
            $ref = sprintf('%s-%03d', $prefix, $entity->getId());

            $entity->setRef($ref);

            $entityManager = $args->getObjectManager();
            $entityManager->persist($entity);
            $entityManager->flush();
        }
    }
}
