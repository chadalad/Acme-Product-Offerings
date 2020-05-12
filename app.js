const app = document.querySelector('#app');
const offerings = fetch('https://acme-users-api-rev.herokuapp.com/api/offerings');
const companies = fetch('https://acme-users-api-rev.herokuapp.com/api/companies');
const products = fetch('https://acme-users-api-rev.herokuapp.com/api/products');

/*
products.then(res => {
    return res.json();
}).then( data => {
    console.log(data);
    for(let i = 0; i < data.length; i++) {
        const id = data[i].id;
        const name = data[i].name;
        const description = data[i].description;
        const suggestedPrice = data[i].suggestedPrice;
        offerings.then(res2 => {
            return res2.json();
        })
        .then(data2 => {
            for(let j = 0; j < data2.length; j++) {
                if(data2[j].productId === id) {
                    app.append(createProductContainer(name, description, suggestedPrice, [['company1', 15],['co2', 11]]));
                }
            }
        })
    }
})
*/

/*
offerings.then(res => {
    return res.json();
}).then( data => {
    console.log(data);
    for(let i = 0; i < data.length; i++) {

    }
})
*/


const allResponses = Promise.all([offerings, companies, products]);

allResponses
    .then(responses => {
        const offeringsResponse = responses[0].json();
        const companiesResponse = responses[1].json();
        const productsResponse = responses[2].json();


        //console.log(offeringsResponse);

        return Promise.all([offeringsResponse, companiesResponse, productsResponse]);
    })
    .then( dataArr => {
        console.log(dataArr);
        const offeringsData = dataArr[0];
        const companiesData = dataArr[1];
        const productsData = dataArr[2];

        for(let i = 0; i < productsData.length; i++) {
            const id = productsData[i].id;
            const name = productsData[i].name;
            const description = productsData[i].description;
            const suggestedPrice = productsData[i].suggestedPrice.toFixed(2);
            const compArr = [];

            for(let j = 0; j < offeringsData.length; j++) {
                if(offeringsData[j].productId === id) {
                    console.log(offeringsData[j]);
                    for(let k = 0; k < companiesData.length; k++) {
                        const offerArr = [];
                        if(companiesData[k].id === offeringsData[j].companyId) {
                            offerArr.push(companiesData[k].name)
                            offerArr.push(offeringsData[j].price.toFixed(2))
                            compArr.push(offerArr);
                        }
                    }
                    
                }
                
            }
            app.append(createProductContainer(name, description, suggestedPrice, compArr));
        }

    });

const createNode = (type) => document.createElement(type);

const createHeader = () => {
    const header = createNode('h1');
    header.innerHTML = 'Acme Product Offerings';
    app.append(header);
}


const createProductContainer = (name, description, suggestedPrice, companiesArr) => {
    const productContainer = createNode('div');
    productContainer.classList.add('product')
    const nameContainer = createNode('h2');
    nameContainer.innerHTML = name;
    productContainer.append(nameContainer);

    const descriptionContainer = createNode('div');
    descriptionContainer.innerHTML = description;
    productContainer.append(descriptionContainer);

    const suggestedPriceContainer = createNode('div');
    suggestedPriceContainer.innerHTML = `$${suggestedPrice}`;
    productContainer.append(suggestedPriceContainer);

    const listContainer = createNode('ul');
    //companiesArr = [[companyName, Price],[companyName, Price], ...]
    companiesArr.forEach(currentVal => {
        const listElement = createNode('li');
        listElement.innerHTML = `Offered by: ${currentVal[0]} at $${currentVal[1]}`;
        listContainer.append(listElement);
    })
    productContainer.append(listContainer);
    
    return productContainer;
}

const render = () => {
    app.innerHTML = '';
    createHeader();
}

render();