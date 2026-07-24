#!/usr/bin/env bash
# Downloads the Karnataka Rakshana Vedike hero banners into this folder.
# Run from anywhere:  bash assets/media/banner/fetch-banners.sh
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="https://karnatakarakshanavedike.com/Photos/banner"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
for n in 2 3 4; do
  echo "Downloading banner-$n.jpg ..."
  curl -fSL -A "$UA" -e "https://karnatakarakshanavedike.com/" \
    -o "$DIR/banner-$n.jpg" "$BASE/banner-$n.jpg"
done
echo "Done. Banners saved to $DIR"
