export enum AppStacks {
    FrontEnd = 'WebsiteStack',
    BackEnd = 'RestApiStack',
    EcsEnvironmentStack = 'EcsEnvironmentStack',
    EcsNetworkStack = 'EcsNetworkStack',
    EcsClusterStack = 'EcsClusterStack',
    EcsUsersApiStack = 'EcsUsersApiStack',
    EcsTodosApiStack = 'EcsTodosApiStack',
    EcsSettingsApiStack = 'EcsSettingsApiStack',
}

// TODO: This is just a proof of concept and it could be awesome if utilized correctly
export const KnownPackages = {
    frontendShowcase: {
        relativePath: '../../frontend/showcase',
    },
    backendShowcase: {
        relativePath: '../../backend/showcase',
    },
} as const
