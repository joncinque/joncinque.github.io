{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  strictDeps = true;
  # host/target agnostic programs
  depsBuildBuild = with pkgs; [
  ];
  # compilers & linkers & dependency finding programs
  nativeBuildInputs = with pkgs; [
    bundler
  ];
  # libraries
  buildInputs = with pkgs; [
  ];
}
