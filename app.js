const express = require('express')
const app = express()
const handlebars = require('express-handlebars').engine
const bodyParser = require('body-parser')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore')
const serviceAccount = require('./web2-eb3ab-firebase-adminsdk-wxnie-de1d34fe02.json')

initializeApp({
    credential: cert(serviceAccount)
})
const db = getFirestore()

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.render('primeira_pagina')
})

app.post('/cadastrar', function(req, res){
    db.collection('Clientes').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        console.log('Dados cadastrados com sucesso!')
        res.send('Dados cadastrados com sucesso!')
    }).catch((error) => {
        console.error('Erro ao cadastrar:', error)
        res.status(500).send('Erro ao cadastrar')
    })
})

app.get('/consultar', function(req, res){
    db.collection('Clientes').get().then((snapshot) => {
        let clientes = []
        snapshot.forEach((doc) => {
            clientes.push({ id: doc.id, ...doc.data() })
        })
        console.log('Dados consultados com sucesso')
        res.json(clientes)
    }).catch((error) => {
        console.error('Erro ao consultar:', error)
        res.status(500).send('Erro ao consultar')
    })
})

// Atualizar cliente por ID
app.put('/atualizar/:id', function(req, res) {
    const clienteId = req.params.id
    const clienteData = {
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }
    
    db.collection('Clientes').doc(clienteId).update(clienteData)
    .then(() => {
        console.log('Dados atualizados com sucesso!')
        res.send('Dados atualizados com sucesso!')
    })
    .catch((error) => {
        console.error('Erro ao atualizar:', error)
        res.status(500).send('Erro ao atualizar')
    })
})

// Deletar cliente por ID
app.delete('/deletar/:id', function(req, res) {
    const clienteId = req.params.id
    
    db.collection('Clientes').doc(clienteId).delete()
    .then(() => {
        console.log('Dados deletados com sucesso!')
        res.send('Dados deletados com sucesso!')
    })
    .catch((error) => {
        console.error('Erro ao deletar:', error)
        res.status(500).send('Erro ao deletar')
    })
})

app.listen(8081, function(){
    console.log("Servidor Ativo!")
})