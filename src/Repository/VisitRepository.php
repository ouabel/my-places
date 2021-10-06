<?php

namespace App\Repository;

use App\Entity\Visit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method Visit|null find($id, $lockMode = null, $lockVersion = null)
 * @method Visit|null findOneBy(array $criteria, array $orderBy = null)
 * @method Visit[]    findAll()
 * @method Visit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VisitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Visit::class);
    }

    public function findFirstAndLastByVisitor(UserInterface $visitor)
    {
        $visits = [];
        $conn = $this->getEntityManager()->getConnection();
        $sql = "
select min(visited_at) visited_at, postcode, min(city) city, count(postcode) visits
from visit
where visitor_id = ?
group by postcode, visitor_id
union all
select max(visited_at) visited_at, postcode, min(city) city, count(postcode) visits
from visit
where visitor_id = ?
group by postcode, visitor_id
";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(1, $visitor->getId());
        $stmt->bindValue(2, $visitor->getId());
        foreach ($stmt->executeQuery()->fetchAllAssociative() as $i => $visit) {
            $visits[$visit['postcode']]['postcode'] = $visit['postcode'];
            $visits[$visit['postcode']]['city'] = $visit['city'];
            $visits[$visit['postcode']]['count'] = $visit['visits'];
            $visits[$visit['postcode']]['visits'][] = $visit['visited_at'];
        }
        return array_values($visits);
    }

    public function findAllByVisitorAndPostCode(UserInterface $visitor, string $postcode)
    {
        $conn = $this->getEntityManager()->getConnection();
        $sql = "select visited_at from visit where visitor_id = ? and postcode = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(1, $visitor->getId());
        $stmt->bindValue(2, $postcode);
        return array_merge(...$stmt->executeQuery()->fetchAllNumeric());
    }
}
