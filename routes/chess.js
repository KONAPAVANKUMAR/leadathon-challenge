
// router
var express = require('express')
var router = express.Router()
// scrape from url
var url = 'https://www.chessgames.com/chessecohelp.html'
// get html from url
var request = require('request')
// chess model
var CodeModel = require('../models/models')
var codes = []

request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
        // parse html
        var cheerio = require('cheerio')
        var $ = cheerio.load(html)
        // get all tr and place in array
        var tr = $('tr')
        tr.each(function (i, elem) {
            // find td in each
            var td = $(this).find('td')
            // get all td and print
            var tdArray = []
            td.each(function (i, elem) {
                tdArray.push($(this).text())
            })
            // split by \n
            codes.push(new CodeModel(tdArray[0], tdArray[1].split('\n')[0],tdArray[1].split('\n')[1]))
        })
    }
})

// get request
router.get('/', function(req, res, next) {
    res.json(codes);
});

// get request by code
router.get('/:code', function(req, res, next) {
    var code = req.params.code
    var codeModel = codes.find(function(element) {
        return element.code == code
    })
    res.json(codeModel)
});

router.get('/*',function(req,res){
    var currentSteps = req.params[0].split('/')
    // pop first element and assign to code
    var codeToFind = currentSteps.shift()
    currentSteps = currentSteps.join(' ')


    var codeModel = codes.find(function(element) {
        return element.code == codeToFind
    })

    var formula = codeModel.formula
    formula = formula.split(' ')

    formula = formula.filter(function(element) {
        return isNaN(element)
    })

    console.log(codeToFind,formula)
    currentSteps = currentSteps.split(' ')

    // pop front for both lists till they are equal
    while(formula.length > 0 && currentSteps.length > 0){
        if(formula[0] == currentSteps[0]){
            formula.shift()
            currentSteps.shift()
        }else{
            formula.shift()
        }
    }

    res.send(formula[0])

    
})

// export router
module.exports = router;
