const Save = async (data, timestamp) => {
    //let uri = 'http://localhost:3000/data';

    let uri = 'http://klara.fit.vutbr.cz:3000/data';
    let saveData = {
        colors: data,
        timestamp_s: timestamp / 1000
    };

    await fetch(uri, {
        method: 'POST',
        body: JSON.stringify(saveData),
        headers: { 'Content-Type': 'application/json' }
    });

    //window.location.replace('index.html'); na konci dotazníku načte znova stránku
}