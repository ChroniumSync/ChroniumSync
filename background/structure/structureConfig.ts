export interface DirectoryStructure {
  [name: string]: DirectoryStructure | null
}

export const projectStructure: DirectoryStructure = {
  src: {
    api: null,
    services: null,
    components: null,
    utils: null,
  },
  config: null,
  scripts: null,
  public: {
    assets: null,
    index.html: null,
  },
  tests: {
    unit: null,
    integration: null,
  },
  ".env.example": null,
  "package.json": null,
  "tsconfig.json": null,
}
