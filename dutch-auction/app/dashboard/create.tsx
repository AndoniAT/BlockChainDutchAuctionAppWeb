'use client';
import { FormEvent, useEffect, useState } from "react";
import { useMyContext } from "./context";

interface ArticleCreate  {
    name:string
};

const Create = () => {
    const { contract, signer } = useMyContext();
    const [ articles, setArticles ] = useState<any[]>([]);
    const [ textConfirm, setTextConfirm ] = useState<string>('');
    const [ closedAuction, setClosedAuction ] = useState<boolean>(true);
    
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
     
        const formData = new FormData(event.currentTarget)
        let name = formData.get('name') ? formData.get('name')+'' : '';
        name = name.trim();

        let sendArticles = formData.getAll('article').filter( (a:any) => a.trim().length > 0 )
        
        if( sendArticles.length > 0 && name.length > 0 ) {
            if( signer && contract ) {
                try {
                    // Envoyer la transaction en envoyant en parametres l'index de l'article et l'id de l'enchère
                    const signedTransaction = await signer.sendTransaction({
                          to: contract.address,
                          value: 0,
                          data: contract.interface.encodeFunctionData('createAuction', [name, sendArticles, closedAuction]),
                    } );
        
                    const receipt = await signedTransaction.wait();

                    //Redemarrer les articles
                    setArticles([]);
                    setTextConfirm('Votre enchère a été crée')
                  } catch ( e:any ) {
                    console.log( e );
                  }
            }
        }
      }

    const addArticle = () => {
        let newArticles = [ ...articles ];
        newArticles.push(<div style={{margin:'10px'}} key={articles.length}><input type="text" name="article" placeholder="Nom de l'article" style={{border: '1px solid black', padding:'10px' ,borderRadius: '10px'}}/></div>);
        setArticles(newArticles);
    };

    const handleOptionChange = () => {
        setClosedAuction(!closedAuction);
    }
    
    useEffect( () => {
        if( articles.length == 0 ) addArticle();
    }, []);

    return (
        <>
            <div>
                <div style={{ textAlign: 'center', padding: '10px 0', minHeight: '80vh' }}>
                    <h1> Creer un enchere </h1>
                    <div>
                        <form onSubmit={onSubmit} style={{display: 'block'}}>
                            <div>
                                <input type="text" name="name" placeholder="Nom de l'enchere" style={{border: '1px solid black', padding:'10px' ,borderRadius: '10px'}}/>
                            </div>
                            <div style={{ background:'#cdcccc', margin: '10px auto', padding: '10px', width:'fit-content', borderRadius:'5px'}}>
                                <div>
                                    <h5>Articles</h5>
                                </div>
                                { articles }
                                <div style={{margin: '10px'}}>
                                    <button onClick={addArticle} type="button" style={{background: '#70c570', padding: '10px', borderRadius: '10px', border: '1px solid black'}}>Article +</button>
                                </div>
                            </div>
                            <div className="form-group form-check">
                                <input name="closeAuction" type="checkbox" id="closeAuction" className={`form-check-input`} checked={closedAuction} style={{ marginRight: '10px' }} onChange={handleOptionChange}/>
                                <label htmlFor="closeAuction" className="form-check-label">Commencer enchere fermé</label>
                            </div>
                            <div style={{marginTop:'20px'}}>
                                <button type="submit" style={{background: '#7EC9EB', padding: '10px', borderRadius: '10px', border: '1px solid black'}}>Submit</button>
                                <p style={{color: "green"}}>{textConfirm}</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Create;
