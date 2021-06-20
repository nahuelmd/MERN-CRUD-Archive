import React, {Component} from 'react';

class App extends Component {

    constructor() {
        super();
        this.state= {
            title: '',
            description: '',
            date: Date(),
            author:'',
            archiveDate:Date(),
            status: 'available',
            news:[],
            _id: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.addNews = this.addNews.bind(this);
    }

    //AGREGAR LA NOTICIA A LA API
    addNews(e){

        //SI EXISTE EL ID ACTUALIZA CON PUT
        if(this.state._id){
            
            fetch(`/api/news/${this.state._id}`, {
                method:'PUT',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {

                console.log(data);

                M.toast({html: 'Updated' });

                this.setState({title:'',
                description:'',
                date: Date(),
                author:'',
                archiveDate:Date(),
                status: 'available',
                });
                this.fetchNews();

            });
        
            //SI NO EXISTE EL ID INSERTA CON POST
        } else {
            console.log(this.state);
            fetch('/api/news', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                } 
            })
               // .then(res=> console.log(res))
               //pongo el JSON generado con stringify y mensaje de confirmacion
               .then(res=> res.json())
               // .then(data => console.log(data))
               
               //Uso materialize para mensaje de confirmacion con M.toast
               .then(data => {
                   console.log(data)
                   M.toast({html: 'Saved'})
                   this.setState({title:'',
                   description:'',
                   date: Date(),
                   author:'',
                   archiveDate:Date(),
                   status: 'available',
                   });
                   this.fetchNews();
               })
               .catch(err => console.log(err));
        }

        e.preventDefault();
    }


    //Al cargar ejecuto la funcion fetchNews Didmount sirve para eso.
    componentDidMount(){
        console.log('El componente fue montado')
        this.fetchNews();
    }

    fetchNews(){
        fetch('/api/news')
        //Convierto los datos a JSON
        .then(res => res.json())
        .then(data => {
            //obtengo data y luego lo asigno al news[vacio]
            this.setState({news: data});
            console.log(this.state.news)
        });
    }



    //para eliminar, desde el boton delete le paso el parametro del id a la funcion deleteNews
    deleteNews(id){
        if(confirm('Are you sure you want to delete this news?')){
                    console.log('deleting: ', id);
        fetch(`/api/news/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            M.toast({html: 'Deleted'});   
            this.fetchNews();
        })
        }

    }

    editNews(id){
        fetch(`/api/news/${id}`)
        .then(res => res.json())
        // .then(data => console.log(data));
        .then(data => {
            console.log(data)
            this.setState({
                title: data.title,
                description: data.description,
                date: data.date,
                author: data.author,
                archiveDate: data.archiveDate,
                status: data.status,
                _id: data._id
            })        
        });

    }

    archiveNews(id){
        if(confirm(`Are you sure you want to archive this news? ID: ${id}`)){
            console.log('archiving: ', id);

            fetch(`/api/news/${id}`)
            .then(res => res.json())
            // .then(data => console.log(data));

            .then(data => {
                console.log(data)
                this.setState({
                    title: data.title,
                    description: data.description,
                    date: data.date,
                    author: data.author,
                    archiveDate: data.archiveDate,
                    status: 'archived',
                    _id: data._id
                });
                if(this.state._id){
            
                    fetch(`/api/news/${this.state._id}`, {
                        method:'PUT',
                        body: JSON.stringify(this.state),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })

                    .then(res => res.json())
                    .then(data => {
        
                        console.log(data);
        
                        M.toast({html: 'Archived' });
        
                        //Seteo el estado de la aplicacion que es el que se muestra en el form
                        this.setState({title:'',
                        description:'',
                        date: Date(),
                        author:'',
                        archiveDate:Date(),
                        status: 'available',
                        _id: ''
                        });
                        this.fetchNews();
        
                    });
                
                    //SI NO EXISTE EL ID INSERTA CON POST
                }

            
            });
        }


        

    };




//Manejador de cambios form
    handleChange(e) {
        // console.log(e.target.name.value)
        const {name, value} = e.target;
        this.setState({
            [name]: value,
            
        });
    }



//Incluir el render en un IF asociado a una variable del estado. Si esta en vistaNueva muestra el form para agregar una nueva noticia. 
//Si no esta vistaNueva y esta vistaArchived, entonces renderiza una nueva vista con los (divs que quiera incluir y armonizados con Materilize). 

//Render en HTML    
    render() {
        return(
            <div>
                {/* NAVEGACION */}
                <nav className="light-blue darken-4" >
                    <div className="container">
                        <a className="brand-logo" href="/">All Funds</a>
                    </div>
                </nav>

                {/* CONTENEDOR PRINCIPAL APLICACION */}
                <div className="container">
                    <div className="row">
                        <div className="col s5">
                            <div className="card" >
                                <div className="card-content">
                                    <form onSubmit={this.addNews} >
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input type="text" name="title" placeholder="News Title" value={this.state.title} onChange={this.handleChange} ></input>
                                                <input type="hidden" name="date" id="date"  value={this.state.date} onChange={this.handleChange}></input>
                                                <input type="hidden" name="status" id="status" value={this.state.status} value="available" onChange={this.handleChange} ></input>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="input-field col s12">
                                               <textarea placeholder="News Description" name="description" value={this.state.description} className="materialize-textarea" onChange={this.handleChange}></textarea>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input type="text" placeholder="Author" name="author" value={this.state.author}  onChange={this.handleChange}></input>                                                
                                            </div>
                                        </div>
                                        <button type="submit" className="btn light-blue darken-4">
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>

                        </div>
                        <div className="col s7">        
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Date of creation</th>
                                        <th>Author</th>
                                        <th>Archive Date</th>
                                        <th>Stauts</th>
                                    </tr>
                                </thead>


                                <tbody>
                                    {
                                        this.state.news.map(news => {
                                            return (
                                                <tr key={news._id}>
                                                    <td>{news.title}</td>
                                                    <td>{news.description}</td>
                                                    <td>{news.date}</td>
                                                    <td>{news.author}</td>
                                                    <td>{news.archiveDate}</td>
                                                    <td>{news.status}</td>
                                                    <td>
                                                        <button className="btn light-blue darken-4" style={{margin: '1px'}}><i className="material-icons" onClick={() => this.editNews(news._id)} >edit</i></button>
                                                        <button className="btn light-blue darken-4" style={{margin: '1px'}}><i className="material-icons" onClick={() => this.deleteNews(news._id)} >delete</i></button>
                                                        <button className="btn light-blue darken-4" style={{margin: '1px'}}><i className="material-icons" onClick={() => this.archiveNews(news._id)} >archive</i></button>
                                                        
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>                    
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default App;