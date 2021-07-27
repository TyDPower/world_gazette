import * as utils from "./utilities.js";

export const ctryInfo = (data) => {

    $("#modalContent").html("")
    $("#modalTitle").html(data.restCtry.name)

    $("#infoModal").show()

    let areaSize = data.restCtry.area.toLocaleString();
    let population = data.restCtry.population.toLocaleString();

    $("#modalContent").append(`
        
        <div>
            <img src="${data.restCtry.flag}" alt="${data.restCtry.name} Flag" style="width: 100%;">
        </div>
        <br>
        <table id="ctryTable" class="table">
            <tr>
                <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-info-circle"></i></span>  Official</th>
                <th></th>
            </tr>
            <tr>
                <td>Native Name</td>
                <td class="right-col">${data.restCtry.nativeName}</td>
            </tr>
            <tr>
                <td>Region</td>
                <td class="right-col">${data.restCtry.region}</td>
            </tr>
            <tr>
                <td>Subregion</td>
                <td class="right-col">${data.restCtry.subregion}</td>
            </tr>
            <tr>
                <td>ISO Alpha-2</td>
                <td class="right-col">${data.restCtry.alpha2Code}</td>
            </tr>
            <tr>
                <td>ISO Alpha-3</td>
                <td class="right-col">${data.restCtry.alpha3Code}</td>
            </tr>
            <tr>
                <td>Area Size</td>
                <td class="right-col">${areaSize}km<sup>2</sup></td>
            </tr>
            <tr>
                <td>Population</td>
                <td class="right-col">${population}</td>
            </tr>
            <tr>
                <td>Capital City</td>
                <td class="right-col">${data.restCtry.capital}</td>
            </tr>
            <tr>
                <td>Dailing Code</td>
                <td class="right-col">+${data.restCtry.callingCodes[0]}</td>
            </tr>
            <tr>
                <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="far fa-money-bill-alt"></i></span> Currency</th>
                <th></th>
            </tr>
            <tr>
                <td>Name</td>
                <td class="right-col">${data.restCtry.currencies[0].name}</td>
            </tr>
            <tr>
                <td>Code</td>
                <td class="right-col">${data.restCtry.currencies[0].code}</td>
            </tr>
            <tr>
                <td>Symbol</td>
                <td class="right-col">${data.restCtry.currencies[0].symbol}</td>
            </tr>
            <tr>
                <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-road"></i></span> Driving</th>
                <th></th>
            </tr>
            <tr>
                <td>Speed in</td>
                <td class="right-col">${data.openCage.annotations.roadinfo.speed_in}</td>
            </tr>
            <tr>
                <td>Drive on</td>
                <td class="right-col">${data.openCage.annotations.roadinfo.drive_on}</td>
            </tr>
            <tr>
            <tr>
                <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-language"></i></span> Language</th>
                <th></th>
            </tr>
            <tr>
                <td>Languages</td>
                <td id="langCon" class="right-col"></td>
            </tr>
            <tr>
                <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="far fa-clock"></i></span> Timezone</th>
                <th></th>
            </tr>
            <tr>
                <td>Timezones</td>
                <td id="tzCon" class="right-col"></td>
            </tr>
            <tr>
                <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-glass-cheers"></i></span> Holidays</th>
                <th></th>
            </tr>
        </table>
    `)

    $.each(data.restCtry.languages, (i, obj)=> {
        $("#langCon").append(`${obj.name}<br>`)
    })

    $.each(data.restCtry.timezones, (i, tz)=> {
        $("#tzCon").append(`${tz}<br>`)
    })

    $.each(data.holidays, (i, holiday)=> {
        $("#ctryTable").append(`
            <tr>
                <td>${holiday.name}</td>
                <td>${utils.reverseStr(holiday.date)}</span></td>
            </tr>
        `)
    })

    return data;
    
}

export const exRates = (data) => {

    $("#modalContent").html("")
    $("#modalTitle").html(data.restCtry.name)

    $("#infoModal").show()
    $("#modalContent").append(`
        <table id="exRatesTable" class="table">
            <tr>
                <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-coins"></i></span> Exchange</th>
                <th></th>
            </tr>
        </table>
    `)

    $.each(data.exRates, (i, rate)=> {
        for (const [key, value] of Object.entries(rate)) {
            $("#exRatesTable").append(`
                <tr>
                    <td><img src="./img/currencyFlags/${key}.png" onerror=this.src="./img/currencyFlags/flagPlaceHolder.png" alt="${key} Flag"></td>
                    <td>${key} ${value}</td>
                </tr>
            `);
        };
    });
}

export const news = (data) => {

    $("#modalContent").html("")
    $("#modalTitle").html(data.restCtry.name)

    $("#infoModal").show()

    $("#modalContent").append(`

        <h4 class="table-headings"><span style="font-size: 30px; color: black;"><i class="far fa-newspaper"></i></span> News Headlines</h4>
        <hr>
    `)

    $.each(data.news, (i, news)=> {
        $("#modalContent").append(`
            <div class="card w-100 p-3" style="width: 18rem;">
                <img src="${news.image.url}" class="card-img-top" alt="${news.title} picture" onerror=this.src="./img/imgPlaceholders/newsPlaceholder.svg">
                <div class="card-body">
                    <h5 class="card-title">${news.title}</h5>
                    <p class="card-text">${news.description}</p>
                    <a href="${news.url}" target="_blank" class="btn btn-dark">Read More</a>
                </div>
            </div><br>
        `)
    })
    
}

export const stats = (data) => {

    let symbol = data.restCtry.currencies[0].symbol;

    $("#modalContent").html("")
    $("#modalTitle").html(data.restCtry.name)

    $("#infoModal").show()

    $("#modalContent").append(`

        <h4><span style="font-size: 30px; color: black;"><i class="fas fa-shopping-cart"></i> Item Prices</h4>

        <table id="pricesTable" class="table">
            <tr>
                <th>Items & Prices<span class="stats-currency-in"> (Currency in ${data.prices.currency})</span></th>
            </tr>
        </table>
    `)

    $.each(data.prices.prices, (i, obj)=> {

        $("#pricesTable").append(`
            <tr>
                <td>
                    ${obj.item_name}<br>
                    <class="right-col">Low: ${utils.checkValue(symbol, obj.lowest_price)} | High: ${utils.checkValue(symbol, obj.highest_price)} | Avg: ${utils.checkValue(symbol, obj.average_price)}
                </td>
            </tr>
            
        `)
    })

}

export const gallery = (data) => {
    
    $("#modalContent").html("")
    $("#modalTitle").html(data.restCtry.name)

    $("#infoModal").show()

    $("#modalContent").append(`

        <h4><span style="font-size: 30px; color: black;"><i class="far fa-images"></i></span> Gallery</h4>
        <hr>

        <div id="imgGallery" class="carousel slide" data-bs-ride="carousel">
            <div id="imgCarousel" class="carousel-inner" role="listbox">
                <div class="carousel-item active">
                <img src="${data.restCtry.flag}" class="d-block w-100" alt="${data.restCtry.name} Flag">
                </div>
            </div>
        </div>
        

    `)

    $.each(data.images, (i, img)=> {
        $("#imgCarousel").append(`
            <div id="img${i}" class="carousel-item">
                <img src="${img.large}" class="d-block w-100" alt="Gallery Image">
            </div>
        `)
    })

    $("#imgCarousel").append(`
        <a class="carousel-control-prev" href="#imgGallery" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon"></span>
        </a>
        <a class="carousel-control-next" href="#imgGallery" role="button" data-slide="next">
            <span class="carousel-control-next-icon"></span>
        </a>
    `)


}

export const wiki = (data) => {

    $("#modalContent").html("")
    $("#modalTitle").html(data.restCtry.name)

    $("#infoModal").show()

    $("#modalContent").append(`

        <h4 class="table-headings"><span style="font-size: 30px; color: black;"><i class="fab fa-wikipedia-w"></i></span> Wiki Articles</h4>
        <hr>
    `)

    $.each(data.wiki, (i, wiki)=> {
        $("#modalContent").append(`
            <div class="card w-100 p-3" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${wiki.title}</h5>
                    <p class="card-text">${wiki.summary}</p>
                    <a href="https://${wiki.wikipediaUrl}" target="_blank" class="btn btn-dark">Read More</a>
                </div>
            </div><br>
        `)
    })
    
} 