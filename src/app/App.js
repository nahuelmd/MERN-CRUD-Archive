import React, {Component} from 'react';
import news from '../models/news';

class App extends Component {
    constructor() {
        super();
        this.state= {
            title: '',
            description: '',
            date: Date(),
            author:'',
            archiveDate:'',
            status: 'available',
            news:[],
            _id: '',
            view: 'available'
        };
        this.handleChange = this.handleChange.bind(this);
        this.addNews = this.addNews.bind(this);
    }

    //Get data from API  and sort by Date of creation
    fetchNews(){
        fetch('/api/news')
         //Convierto los datos a JSON
        .then(res => res.json())
        .then(data => {
            //obtengo data y luego lo asigno al news que ya viene vacio desde el state de la app []
            this.setState({news: data});

            // console.log(this.state.news)

            var ordenado = (this.state.news)        
            const newOrdenado = ordenado.sort(byDate);
            //sort by date, first newer
            function byDate(a, b) {
                return new Date(b.date).valueOf() - new Date(a.date).valueOf() ;
            }            
            this.setState({news: newOrdenado})
        });
    }
    //Get ARCHIVED data from API  and sort by Date of archived
    fetchArchivedNews(){
        fetch('/api/news')
        //Convierto los datos a JSON
        .then(res => res.json())
        .then(data => {
            //obtengo data y luego lo asigno al news que ya viene vacio desde el state de la app []
            this.setState({news: data});

            // console.log(this.state.news)
            var filtrado =  (this.state.news)        
            var ordenado = filtrado.filter(element => element.status === "archived")
            const newOrdenado = ordenado.sort(byDate);
            //sort by date, first newer
            function byDate(a, b) {
                return new Date(b.archiveDate).valueOf() - new Date(a.archiveDate).valueOf() ;
            }            
            this.setState({news: newOrdenado})
        });
    }
    //Get AVAILABLE data from API  and sort by Date of creation
    fetchAvailableNews(){
        fetch('/api/news')
        //Convierto los datos a JSON
        .then(res => res.json())
        .then(data => {
            //obtengo data y luego lo asigno al news que ya viene vacio desde el state de la app []
            this.setState({news: data});

            // console.log(this.state.news)
            var filtrado =  (this.state.news)        
            var ordenado = filtrado.filter(element => element.status === "available")
            const newOrdenado = ordenado.sort(byDate);
            //sort by date, first newer
            function byDate(a, b) {
                return new Date(b.date).valueOf() - new Date(a.date).valueOf() ;
            }            
            this.setState({news: newOrdenado})
        });
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
                archiveDate:'',
                status: 'available',
                });
                this.setState({view: 'available'})
                this.fetchAvailableNews();

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
                   archiveDate:'',
                   status: 'available',
                   });
                   this.setState({view: 'available'})
                   this.fetchAvailableNews();
               })
               .catch(err => console.log(err));
        }

        e.preventDefault();
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
            this.setState({view: 'archived'})
            this.fetchArchivedNews()
        })
        }

    }
    //para editar, desde el boton delete le paso el parametro del id a la funcion deleteNews
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
    //para archivar, desde el boton delete le paso el parametro del id a la funcion deleteNews
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
                    archiveDate: Date(),
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
                        this.fetchAvailableNews()
        
                    });
                
                    //SI NO EXISTE EL ID INSERTA CON POST
                }

            
            });
        }


        

    };
    //para desarchivar, desde el boton delete le paso el parametro del id a la funcion deleteNews
    unArchiveNews(id){
        if(confirm(`Are you sure you want to unarchive this news? ID: ${id}`)){
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
                    archiveDate: '',
                    status: 'available',
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
        
                        M.toast({html: 'Unarchived' });
        
                        //Seteo el estado de la aplicacion que es el que se muestra en el form
                        this.setState({title:'',
                        description:'',
                        date: data.date,
                        author:'',
                        archiveDate:Date(),
                        status: 'available',
                        _id: '',                        
                        });
                        this.setState({view: 'available'})
                        this.fetchAvailableNews()
        
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

    //Render en HTML

    viewChanger(){
    
    // this.fetchArchivedNews(); 
    // console.log(this.state.view)
        
    this.setState({view: 'archived'})
    this.fetchArchivedNews()
    console.log(this.state.view)

    // if (this.state.view == 'archived'){
    //     console.log('Esta en archived')
    // }

    // if (this.state.view == 'archived'){
    //     this.fetchArchivedNews()
    // } else {
    //     this.fetchNews();
    // }


    }
        //Al cargar la aplicacion ejecuto la funcion fetchNews Didmount sirve para eso.
    //Carga todas las noticias. 
    componentDidMount(){
        // this.fetchNews();        
        this.fetchAvailableNews()
        console.log('El componente fetchAvailableNews fue montado')
    }

    render() {     
        
        if (this.state.view == 'available'){
        
            return(
                <div>
                    {/* NAVEGACION */}
                    <nav className="light-blue darken-4" >
                        <div className="container">
                            <a className="brand-logo" href="/">New</a>
                        </div>                    
                    </nav>
                    <nav className="light-blue darken-4" >
                        <div className="container">
                            <a className="brand-logo" href="/" onClick={() => this.viewChanger()} >Archived</a>
                            {/* <a className="brand-logo" onClick={() => this.setState({view: 'archived'})} >Archived News</a> */}
                        </div>                    
                    </nav>
    
                    {/* CONTENEDOR PRINCIPAL APLICACION */}
                    <div className="container">
                    <h1>Add a News</h1>
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
                                                            {/* <button className="btn light-blue darken-4" style={{margin: '1px'}}><i className="material-icons" onClick={() => this.deleteNews(news._id)} >delete</i></button> */}
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

        } else if (this.state.view == 'archived'){
            // this.fetchArchivedNews()
            return(
                <div>
                    {/* NAVEGACION */}
                    <nav className="light-blue darken-4" >
                        <div className="container">
                            <a className="brand-logo" href="/">New</a>
                        </div>                    
                    </nav>
                    <nav className="light-blue darken-4" >
                        <div className="container">
                            <a className="brand-logo" onClick={() => this.viewChanger()} >Archived</a>
                            {/* <a className="brand-logo" onClick={() => this.setState({view: 'archived'})} >Archived News</a> */}
                        </div>                    
                    </nav>
    
                    {/* CONTENEDOR PRINCIPAL APLICACION */}
                    <div className="container">
                    <h1>Archived News</h1>
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
                                                            {/* <button className="btn light-blue darken-4" style={{margin: '1px'}}><i className="material-icons" onClick={() => this.editNews(news._id)} >edit</i></button> */}
                                                            <button className="btn light-blue darken-4" style={{margin: '1px'}}><i className="material-icons" onClick={() => this.deleteNews(news._id)} >delete</i></button>
                                                            <button className="btn light-blue darken-4" style={{margin: '1px'}}><i className="material-icons" onClick={() => this.unArchiveNews(news._id)} >undo</i></button>
                                                            
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

        else {
            console.log('No tomo ninguno')
        }
        

    }
}

export default App;