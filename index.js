const fs = require('fs')

const express = require ('express')

const app = express()

const puerto = 8080

class Contenedor {
	constructor(fileName) {
		this.fileName = fileName
		fs.promises.writeFile(`./${fileName}`, '')
	}
	async save(objeto) {
		let data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')
		if (!data) {
			objeto.id = 1
			const arr = [objeto]
			await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(arr))
			return objeto.id
		} else {
			data = JSON.parse(data)
			objeto.id = data.length + 1
			data.push(objeto)
			await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(data))
			return objeto.id
		}
	}

	async getById(id) {
		try {
			let data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')
			data = JSON.parse(data)
			data = data.find(product => product.id === id)

			data ? console.log(data) : console.log(null)
		} catch {
			console.log('error, no se pudieron leer los productos')
		}
	}

    async getAll() {
        try{
            let data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')
            data = JSON.parse(data)
            return data
        }
        catch{

            console.log('Error no se puede leer el archivo')
        }
    }

    async deleteById(id){
        try {
			let data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')
			data = JSON.parse(data)
			data = data.filter(product => product.id != id)

			 console.log(data) 
		} catch {
			console.log('no se pudieron leer los productos')
		}
	
    }

    async deleteAll() {
        try {
			let data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')
			data = JSON.parse(data)
			data = []

			 console.log(data) 
		} catch {
			console.log('no se pudieron leer los productos')
		}

    }

    async getRandom(){
        try{
            let dataR = await fs.promises.readFile(`./${this.fileName}`,'utf-8')
            dataR = JSON.parse(dataR)
            const productR = dataR[Math.floor(Math.random() * dataR.length)]

            return productR
        }
        catch{
            console.log('error no se puede leer el archivo')
        }
    }
}
const productos = new Contenedor('productos.txt')

const objeto1 = {
	nombre: 'CLIO',
	precio: 1000000,
	thumbnail:('./img/clio.jpg'),
}

const objeto2 = {
	nombre: 'FOCUS',
	precio: 3000000,
	thumbnail:('./img/focus.jpg'),
}

const objeto3 = {
	nombre: 'CORSA',
	precio: 800000,
	thumbnail:('./img/corsa.jpg'),
}

const test = async () => {
	await productos.save(objeto1)
	await productos.save(objeto2)
	await productos.save(objeto3)
	await productos.getById(1)
    await productos.getAll()
    await productos.deleteById(3)
    await productos.deleteAll()
}

test()


const listaProductos = async (req, res) => {
	const respuesta = await productos.getAll()
	res.send(respuesta)
}

const productoRandom = async (req, res) => {
	const respuesta = await productos.getRandom()
	res.send(respuesta)
}

app.get('/',(req, res) =>{
    res.send('<h1>hola soy ruta home</h1>')
})
app.get('/productos', listaProductos)
app.get('/productoRandom', productoRandom)


app.listen(puerto,() => {
    console.log('servidor escuchando')
})