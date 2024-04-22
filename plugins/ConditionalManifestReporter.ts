import * as path from "node:path";
import { Reporter } from "@parcel/plugin";
import type { BuildEvent } from "@parcel/types";

export default new Reporter({
    async report({ event, options, logger }) {
        if (event.type === "buildSuccess") {
            const conditions = event.bundleGraph.unstable_getConditionalBundleMapping();
            // console.log(JSON.stringify(conditions,null,2));
            // Replace bundles with file paths..
            const mapBundles = (bundles) =>
                bundles.map((bundle) =>
                    path.relative(options.projectRoot, bundle.filePath)
                );
            for (const [key, cond] of Object.entries(conditions)) {
                cond.bundlesWithCondition = mapBundles(
                    cond.bundlesWithCondition
                );
                cond.ifTrueBundles = mapBundles(cond.ifTrueBundles).reverse();
                cond.ifFalseBundles = mapBundles(cond.ifFalseBundles).reverse();
            }
            const conditionalManifest = JSON.stringify(conditions, null, 2);

            // FIXME get distDir from target?
            const conditionalManifestFilename = path.join("dist", "conditional-manifest.json");
            await options.outputFS.writeFile(
                conditionalManifestFilename,
                conditionalManifest,
                { mode: 0o666 }
            );

            logger.info({ message: "Wrote conditional manifest to " + conditionalManifestFilename });
        }
    },
});
