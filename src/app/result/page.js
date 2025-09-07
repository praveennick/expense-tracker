import ResultPage from '@/pages/ResultPage'
import React, { Suspense } from "react";

function Result() {
    return (
        <Suspense fallback={<div>Loading Result...</div>}>
            <ResultPage />
        </Suspense>
    )
}

export default Result