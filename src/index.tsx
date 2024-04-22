import React, { Suspense, useState } from "react";
import ReactDOM from "react-dom/client";
import { RegularExport } from "./regular-import";

function LazyComponentContainer() {
    const LazyComponent = React.lazy(() => import("./lazy-component"));
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <LazyComponent />
        </Suspense>
    );
}

const App = () => {
    const [showLazyComponent, setShowLazyComponent] = useState(false);
    
    const feature = importCond<typeof import("./feature-enabled")>(
        "my.feature",
        "./feature-enabled",
        "./feature-disabled"
    );
    const featureWithUI = importCond<typeof import("./feature-ui-enabled")>(
        "feature.ui",
        "./feature-ui-enabled",
        "./feature-ui-disabled"
    );
    console.log(feature, featureWithUI);
    return (
        <div>
            <p>Hello from React</p>
            <button onClick={() => setShowLazyComponent(!showLazyComponent)}>Toggle lazy component</button>
            <p>Conditional Feature: {feature.Feature()}</p>
            <featureWithUI.Component />
            {showLazyComponent ? <LazyComponentContainer /> : null}
        </div>
    );
};

const $el = document.getElementById("container")!;
const root = ReactDOM.createRoot($el);
root.render(<App />);