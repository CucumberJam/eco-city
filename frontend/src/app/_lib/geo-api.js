async function getAddress({latitude, longitude}){
    try{
        const res = await fetch(
            `https://api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`)
        if(!res.ok) throw new Error('Ошибка получения адреса');
        const data = await res.json();
        return {success: true, data}
    }catch (e) {
        console.log(e);
        return {success: false, message: e.message}
    }
}
function getPosition(){
    return new Promise(function (resolve, reject){
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

export async function fetchAddress(){
    const positionObj = await getPosition();
    //console.log(positionObj);
    const position = {
        latitude: positionObj.coords.latitude,
        longitude: positionObj.coords.longitude,
    };
    const addressObj = await getAddress(position);
   // console.log(addressObj);
    const address = {
        country: addressObj?.data?.countryName || '',
        region: addressObj?.data?.principalSubdivision || '',
        city: addressObj.data?.city || '',
        postcode: addressObj.data?.postcode || '',
    };
    return {position, address}
}