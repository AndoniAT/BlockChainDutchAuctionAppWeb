'use client';
import { FormEvent, useEffect, useState } from "react";
import { useMyContext } from "./context";
import { ethers } from "ethers";

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

        // GET parametres de prix
        let auction_duration = formData.get('auction_duration'); 
        let starting_price = formData.get('starting_price');
        let price_decrement = formData.get('price_decrement');
        let reserve_price = formData.get('reserve_price');
        let interval = formData.get('interval');

        if( starting_price && price_decrement && reserve_price  ) {
            var starting_price_eth = ethers.utils.parseUnits(starting_price.toString(), 'ether');
            var price_decrement_eth = ethers.utils.parseUnits(price_decrement.toString(), 'ether');
            var reserve_price_eth = ethers.utils.parseUnits(reserve_price.toString(), 'ether');
        } else {
            return;
        }

        // GET articles
        let sendArticles = formData.getAll('article').filter( (a:any) => a.trim().length > 0 )
        if( sendArticles.length > 0 && name.length > 0 ) {
            if( signer && contract ) {
                let data = [name, sendArticles, closedAuction, auction_duration, starting_price_eth, price_decrement_eth, reserve_price_eth, interval];
                
                try {
                    // Envoyer la transaction en envoyant en parametres l'index de l'article et l'id de l'enchère
                    const signedTransaction = await signer.sendTransaction({
                          to: contract.address,
                          value: 0,
                          data: contract.interface.encodeFunctionData('createAuction', data ),
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
                    <h1 style={{ fontSize:'20px', marginBottom:'20px'}}> Creer un enchere </h1>
                    <div>
                        <form onSubmit={onSubmit} style={{display: 'block'}}>
                            <div style={{display: 'inline-flex'}}>
                                <div style={{ marginRight: '20px'}}>
                                    <div>
                                        <p>Nom de l'enchère</p>
                                        <input type="text" name="name" placeholder="Ex: Mon enchere" style={{border: '1px solid black', padding:'10px' ,borderRadius: '10px'}}/>
                                    </div>
                                    <div style={{marginTop:'10px'}}>
                                        <p>Duration totale de l'enchère (sec)</p>
                                        <input type="number" name="auction_duration" step={1} placeholder="Ex: 3600" style={{border: '1px solid black', padding:'10px' ,borderRadius: '10px'}}/>
                                    </div>
                                    <div style={{marginTop:'10px'}}>
                                        <p>Prix initiale (eth)</p>
                                        <input type="number" name="starting_price" step={0.1} placeholder="Ex: 1" style={{border: '1px solid black', padding:'10px' ,borderRadius: '10px'}}/>
                                    </div>
                                    <div style={{marginTop:'10px'}}>
                                        <p>Baisse de prix (eth)</p>
                                        <input type="number" name="price_decrement" step={0.1} placeholder="Ex: 0.1" style={{border: '1px solid black', padding:'10px' ,borderRadius: '10px'}}/>
                                    </div>
                                    <div style={{marginTop:'10px'}}>
                                        <p>Prix minimum des articles (eth)</p>
                                        <input type="number" name="reserve_price" step={0.1} placeholder="Ex: 0.2" style={{border: '1px solid black', padding:'10px' ,borderRadius: '10px'}}/>
                                    </div>
                                    <div style={{marginTop:'10px'}}>
                                        <p>Temps pour descendre le prix (sec)</p>
                                        <input type="number" name="interval" step={1} placeholder="Ex: 50" style={{border: '1px solid black', padding:'10px' ,borderRadius: '10px'}}/>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ background:'#cdcccc', margin: '10px auto', padding: '10px', width:'fit-content', borderRadius:'5px'}}>
                                        <div>
                                            <h5>Articles</h5>
                                        </div>
                                        { articles }
                                        <div style={{margin: '10px'}}>
                                            <button onClick={addArticle} type="button" style={{background: '#70c570', padding: '10px', borderRadius: '10px', border: '1px solid black'}}>Article +</button>
                                        </div>
                                    </div>
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
