<?php

namespace App\DataFixtures;

use App\Entity\Avatar;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Vich\UploaderBundle\Handler\UploadHandler;
use Faker\Factory;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AvatarFixtures extends Fixture implements FixtureGroupInterface {
    protected $faker;
    private UploadHandler $uploadHandler;

    public function __construct(UploadHandler $uploadHandler) {
        $this->uploadHandler = $uploadHandler;
    }

    public function load(ObjectManager $manager): void {
        $this->faker = Factory::create();
        $filesystem = new Filesystem();
        $tempDir = sys_get_temp_dir(); // Temporary directory for file processing
        $imagePath = $tempDir . '/admin.png';

        // Copy a sample image to the temp directory
        $filesystem->copy(__DIR__ . '/../../public/images/admin.png', $imagePath, true);

        $avatar = new Avatar();
        $avatar->setFile(new UploadedFile(
            $imagePath,
            'admin.png',
            'image/png',
            null,
            true
        ));

        // Use VichUploader to handle file upload
        $this->uploadHandler->upload($avatar, 'file');

        $manager->persist($avatar);
        $this->addReference("AVATAR_0", $avatar);

        $manager->flush();
    }

    public static function getGroups(): array {
        return ['load'];
    }
}
