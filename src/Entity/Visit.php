<?php

namespace App\Entity;

use App\Repository\VisitRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=VisitRepository::class)
 */
class Visit
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $visitor;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private $visitedAt;

    /**
     * @ORM\Column(type="decimal", precision=9, scale=6)
     */
    private $latitude;

    /**
     * @ORM\Column(type="decimal", precision=9, scale=6)
     */
    private $longitude;

    /**
     * @ORM\Column(type="string", length=5)
     */
    private $postcode;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $city;

    public function __construct(UserInterface $visitor, string $latitude, string $longitude, string $postcode, string $address, string $city)
    {
        $this->visitedAt = new \DateTimeImmutable();
        $this->visitor = $visitor;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->postcode = $postcode;
        $this->address = $address;
        $this->city = $city;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getVisitor(): ?UserInterface
    {
        return $this->visitor;
    }

    public function setVisitor(?UserInterface $visitor): self
    {
        $this->visitor = $visitor;

        return $this;
    }

    public function getVisitedAt(): ?\DateTimeImmutable
    {
        return $this->visitedAt;
    }

    public function setVisitedAt(\DateTimeImmutable $visitedAt): self
    {
        $this->visitedAt = $visitedAt;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(string $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(string $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getPostcode(): ?string
    {
        return $this->postcode;
    }

    public function setPostcode(string $postcode): self
    {
        $this->postcode = $postcode;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }
}
