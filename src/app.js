
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express() 
const geocode = require('./Utils/geocode')
const forecast = require('./Utils/forecast')
const port = process.env.PORT || 3000

//define paths for express config

const publicDirectorPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//setup handlebars engine and views location

app.set('view engine','hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

//setup static directory to server

app.use(express.static(publicDirectorPath))

app.get('',(req,res) => {
    res.render('index',{
        title: 'Weather',
        name: 'starky'
    })
})

app.get('/about',(req,res) => {
    res.render('about',{
        title: 'About me', 
        name: 'starky'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
       helpText: "This is some helpful text",
       title: 'Help',
       name: 'starky'
    })
})



app.get('/weather', (req, res) => {
if(!req.query.address){
    return res.send({
        error: 'You must provide an adress'
    })
}
geocode( req.query.address ,(error,{latitude, longitude, location } = {} ) => {
    if(error){
        return res.send({error})
    }
    forecast(latitude, longitude,(error, forecastData) => {
        if(error){
            return res.send({error})
        }
        res.send({
            forecast: forecastData,
            location,
            address: req.query.address
        })
    })
})

    // res.send({
    //     forecast: 'Its currently 50 degrees out',
    //     location: 'Philadelphia',
    //     address: req.query.address
    // })
})




app.get('/products', (req,res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide the search term'
        }) 
    }
    
    console.log(req.query.search)
    res.send({
        products:[]
    })
})




app.get('/help/*',(req,res) => {
    res.render('error', {
        title: '404 help',
        name: 'Starky',
        errorMessage: 'Help article not found'
    })
})

app.get('*',(req,res) => {
    res.render('error',{
        title: 'error',
        name: 'Starky',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port) 
})