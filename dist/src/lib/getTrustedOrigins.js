export function getTrustedOrigins() {
    const origins = process.env.ORIGINS;
    if (origins)
        return origins;
    else {
        throw new Error('Environment variable ORIGINS is not provided. Please set ORIGINS to a comma-separated list of trusted origins.');
    }
}
