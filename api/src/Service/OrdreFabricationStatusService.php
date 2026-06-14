<?php

namespace App\Service;

use App\Entity\Notification;
use App\Entity\OrdreFabrication;
use App\Enum\StatutOF;
use App\Enum\TypeNotification;
use Doctrine\ORM\EntityManagerInterface;

class OrdreFabricationStatusService {
  public function __construct(private EntityManagerInterface $em) {
  }

  public function handleStatusChange(OrdreFabrication $of, StatutOF $old, StatutOF $new): void {
    if ($old === $new) {
      return;
    }

    $client = $of->getClient();
    if (!$client || !$client->getAccount()) {
      return;
    }

    $user = $client->getAccount();

    $notification = new Notification();
    $notification->setAccount($user);
    $notification->setExpediteur('Système');
    $notification->setTitre($this->getTitle($new));
    $notification->setMessage($this->getMessage($of, $old, $new));
    $notification->setDateCreation(new \DateTimeImmutable());
    $notification->setLu(false);
    $notification->setType(TypeNotification::ORDER_STATUS_CHANGED);

    $this->em->persist($notification);
    // Let API Platform or your processor flush later
  }

  private function getTitle(StatutOF $statut): string {
    return match ($statut) {
      StatutOF::BROUILLON => 'OF En Brouillon',
      StatutOF::PREVUE => 'OF Prévue',
      StatutOF::EN_COURS => 'OF En Cours',
      StatutOF::COMPLETE => 'OF Complété',
      StatutOF::ANNULE => 'OF Annulé',
    };
  }

  private function getMessage(OrdreFabrication $of, StatutOF $old, StatutOF $new): string {
    return sprintf(
      'Le Statut de votre Ordre de Fabrication "%s" pour l\'Article "%s" est passé de "%s" à "%s".',
      $of->getRef(),
      $of->getArticle()?->getDesignation() ?? 'Unknown',
      $old->name,
      $new->name
    );
  }
}
