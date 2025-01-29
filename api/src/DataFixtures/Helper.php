<?php

namespace App\DataFixtures;

class Helper {
  public static function roundUpToNearest(int $number, int $nearest): int {
    return intval(ceil($number / $nearest) * $nearest);
  }
}
