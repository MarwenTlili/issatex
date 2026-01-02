<?php

namespace App\Repository;

use App\Entity\OrdreFabrication;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<OrdreFabrication>
 */
class OrdreFabricationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OrdreFabrication::class);
    }

    //    /**
    //     * @return OrdreFabrication[] Returns an array of OrdreFabrication objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('o')
    //            ->andWhere('o.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('o.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?OrdreFabrication
    //    {
    //        return $this->createQueryBuilder('o')
    //            ->andWhere('o.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
