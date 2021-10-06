<?php

namespace App\EventSubscriber;

use App\Event\VisitLogEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class VisitLogSubscriber implements EventSubscriberInterface
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public static function getSubscribedEvents()
    {
        return [VisitLogEvent::NAME => [['onVisitLog', 20]]];
    }

    public function onVisitLog(VisitLogEvent $event)
    {
        $this->em->persist($event->getVisit());
        $this->em->flush();
    }
}