export const DynamicExport = () => "This is a DynamicExport";
export const DynamicExportWithCondition = () => {
    
    return importCond<typeof import('./async-feature-enabled.ts')>('feature.async.condition', './async-feature-enabled.ts', './async-feature-disabled.ts').Feature();

}