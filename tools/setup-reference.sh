#!/usr/bin/env bash
# tools/setup-reference.sh
# Clones and builds the msdfgen reference binary at a pinned commit.
# Output: tools/msdfgen-ref/build/msdfgen
#
# Usage:
#   bash tools/setup-reference.sh
#
# Requirements (macOS):  brew install cmake freetype libpng
# Requirements (Ubuntu): apt-get install -y cmake libfreetype-dev libpng-dev

set -euo pipefail

MSDFGEN_COMMIT="e06c7eaaaa071445ec77a1d73f942889f796b70b"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="$SCRIPT_DIR/msdfgen-ref"
BINARY="$DEST_DIR/build/msdfgen"
STAMP="$DEST_DIR/.pinned-commit"

# Skip rebuild if the binary exists at the right commit.
if [[ -f "$BINARY" && "$(cat "$STAMP" 2>/dev/null)" == "$MSDFGEN_COMMIT" ]]; then
  echo "msdfgen already built at commit $MSDFGEN_COMMIT — skipping."
  exit 0
fi

# ---- dependency checks -------------------------------------------------------

check_cmd() {
  if ! command -v "$1" &>/dev/null; then
    echo "Error: '$1' not found. $2" >&2; exit 1
  fi
}
check_cmd cmake  "Install with: brew install cmake  (macOS) or apt-get install cmake (Ubuntu)"
check_cmd git    "git is required."
check_cmd make   "Install with: xcode-select --install (macOS) or apt-get install build-essential (Ubuntu)"

OS="$(uname -s)"
if [[ "$OS" == "Darwin" ]]; then
  if ! brew ls --versions freetype &>/dev/null; then
    echo "Installing freetype via Homebrew..."
    brew install freetype
  fi
  if ! brew ls --versions libpng &>/dev/null; then
    echo "Installing libpng via Homebrew..."
    brew install libpng
  fi
  CMAKE_PREFIX="$(brew --prefix)"
elif [[ "$OS" == "Linux" ]]; then
  CMAKE_PREFIX="/usr"
  if ! dpkg -l libfreetype-dev &>/dev/null 2>&1 && ! pkg-config --exists freetype2 2>/dev/null; then
    echo "Installing libfreetype-dev and libpng-dev..."
    sudo apt-get install -y libfreetype-dev libpng-dev
  fi
else
  echo "Unsupported OS: $OS" >&2; exit 1
fi

# ---- clone -------------------------------------------------------------------

echo "Cloning Chlumsky/msdfgen at $MSDFGEN_COMMIT..."
rm -rf "$DEST_DIR"
git clone --no-checkout https://github.com/Chlumsky/msdfgen.git "$DEST_DIR"
cd "$DEST_DIR"
git checkout "$MSDFGEN_COMMIT"

# ---- configure + build -------------------------------------------------------
# Flags:
#   MSDFGEN_USE_VCPKG=OFF    use system libraries (freetype/libpng), not vcpkg
#   MSDFGEN_USE_SKIA=OFF     skip Skia; use scanline sign correction instead
#   MSDFGEN_DISABLE_SVG=ON   not needed for font/shapedesc input
#   MSDFGEN_BUILD_STANDALONE=ON  we need the CLI binary

echo "Configuring..."
cmake -S . -B build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_PREFIX_PATH="$CMAKE_PREFIX" \
  -DMSDFGEN_USE_VCPKG=OFF \
  -DMSDFGEN_USE_SKIA=OFF \
  -DMSDFGEN_DISABLE_SVG=ON \
  -DMSDFGEN_BUILD_STANDALONE=ON \
  -DMSDFGEN_INSTALL=OFF

echo "Building..."
CPUS="$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)"
cmake --build build --config Release -j"$CPUS"

echo "$MSDFGEN_COMMIT" > "$STAMP"
echo "Done. Binary: $BINARY"
