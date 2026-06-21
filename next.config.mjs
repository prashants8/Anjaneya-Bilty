// Next.js configuration for Anjaneya Bilty.
import fs from 'fs';

// Monkey patch fs.readlink, fs.readlinkSync, and fs.promises.readlink
// to work around Node.js/Windows exFAT bugs where readlink on a file returns EISDIR.
const patchEISDIR = (err, path) => {
  if (err && err.code === 'EISDIR') {
    try {
      const stats = fs.statSync(path);
      if (stats.isFile()) {
        const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        newErr.code = 'EINVAL';
        newErr.errno = -4071;
        return newErr;
      }
    } catch (e) {}
  }
  return err;
};

const originalReadlink = fs.readlink;
fs.readlink = function (path, options, callback) {
  const cb = typeof options === 'function' ? options : callback;
  const opts = typeof options === 'function' ? {} : options;
  originalReadlink(path, opts, (err, linkString) => {
    cb(patchEISDIR(err, path), linkString);
  });
};

const originalReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (path, options) {
  try {
    return originalReadlinkSync(path, options);
  } catch (err) {
    throw patchEISDIR(err, path);
  }
};

if (fs.promises && fs.promises.readlink) {
  const originalPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (path, options) {
    try {
      return await originalPromisesReadlink(path, options);
    } catch (err) {
      throw patchEISDIR(err, path);
    }
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    config.cache = false;
    return config;
  },
};

export default nextConfig;
