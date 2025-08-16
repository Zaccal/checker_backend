export function partitionTags(tags) {
    const tagConnections = [];
    const newTags = [];
    if (tags) {
        for (const tag of tags) {
            if (typeof tag === 'string') {
                tagConnections.push({ id: tag });
            }
            else {
                newTags.push(tag);
            }
        }
    }
    return {
        tagConnections,
        newTags,
    };
}
