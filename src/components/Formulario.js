import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';
import Error from './Error';

const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover {
        background-color: #326AC0;
        cursor: pointer;
    }
`

const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {

    // State listado de criptomonedas
    const [listacriptomonedas, guardarCriptomonedas] = useState([]);

    const MONEDAS = [
        {codigo: 'USD', nombre: 'Dolar de Estados Unidos'},
        {codigo: 'MXN', nombre: 'Peso Mexicano'},
        {codigo: 'EUR', nombre: 'Euro'},
        {codigo: 'GBP', nombre: 'Libra Esterlina'}
    ]

    // Utilizar useMoneda
    const [ moneda, SelectMonedas ] = useMoneda('Elige tu moneda', '', MONEDAS);
    const [ criptomoneda, SelectCriptomoneda ] = useCriptomoneda('Elige tu criptomoneda', '', listacriptomonedas);
    const [ error, guardarError ] = useState(false);

    // Ejecutar llamado a la API
    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
            const resultado = await axios.get(url);
            //console.log(resultado.data.Data);
            guardarCriptomonedas(resultado.data.Data);
        }
        consultarAPI();
    }, [])

    // Cuando el usuario hace submit
    const cotizarMoneda = e => {
        e.preventDefault();

        // Validar campos llenos
        if(moneda.trim() === '' || criptomoneda.trim() === ''){
            guardarError(true);
            return;
        }
        guardarError(false);

        // Pasar los datos al componente
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);

    }

    return ( 
        <form
            onSubmit={cotizarMoneda}
        >
            {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}

            <SelectMonedas />

            <SelectCriptomoneda /> 

            <Boton 
                type="submit"
                value="Calcular"
            />
        </form>
     );
}
 
export default Formulario;