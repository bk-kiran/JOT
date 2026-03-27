const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const repoRoot = path.resolve(__dirname, "..");

const config = getDefaultConfig(projectRoot);

// Watch repo root so Metro can resolve @convex/* imports
config.watchFolders = [repoRoot];

// When resolving modules from outside jot-app/ (e.g. ../convex/_generated/),
// fall back to jot-app/node_modules so convex/server etc. are found.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
];

// Resolve @convex/* to the convex/ folder at repo root
config.resolver.extraNodeModules = {
  "@convex": path.resolve(repoRoot, "convex"),
};

module.exports = config;
