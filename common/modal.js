export const countryInfo = (data) => {
    $("#countryName").html(data);
    $("#continent").html(data);
    $("#flag").html(data);
    $("#currencyName").html(data);
    $("#currencySubunit").html(data);
    $("#currencySymbol").html(data);
    $("#driveSide").html(data);
    $("#speedUnit").html(data);
    $("#timezoneName").html(data);
    $("#timezoneDst").html(data);
}