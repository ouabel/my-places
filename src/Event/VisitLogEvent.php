<?php

namespace App\Event;

use App\Entity\Visit;
use Symfony\Contracts\EventDispatcher\Event;

class VisitLogEvent extends Event
{
    public const NAME = 'visit.log';

    protected $visit;

    public function __construct(Visit $visit)
    {
        $this->visit = $visit;
    }

    public function getVisit(): Visit
    {
        return $this->visit;
    }
}
