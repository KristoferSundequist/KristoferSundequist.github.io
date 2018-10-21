
export const BuildWorker = function(foo)
{
    var str = foo.toString()
              .match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
    return  new Worker(window.URL.createObjectURL(
                       new Blob([str],{type:'text/javascript'})));
}

function abc(a){
    return a+5
}   

export function Calc()
{
    onmessage = e => {
        (postMessage as any)(abc(e.data))
    }
}