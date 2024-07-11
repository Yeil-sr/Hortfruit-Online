const express = require('express');
const pagamentoController = require('../controllers/pagamentoController.js');
const router = express.Router();
const  {  MercadoPagoConfig ,  Payment } = require('mercadopago');
const  client  =  new  MercadoPagoConfig ( {  accessToken : process.env.MERCAOPAGO_ACCESS_TOKEN ,  options : {  timeout : 5000 ,  idempotencyKey : 'abc'  }  } ) ;


router.post('/criar-pix',(req,res)=>{
    const payment = new Payment(client);
    const body = {
            transaction_amount: req.body.transaction_amount,
            description: req.body.description,
            payment_method_id: req.body.paymentMethodId,
                payer: {
                email: req.body.email,
                identification: {
            type: req.body.identificationType,
            number: req.body.number
        }},
    };
    payment.create({ body })
    .then((result)=>{
        console.log(result)
    })
    .catch((error=>{
        console.log(error)
    }));
    res.status(200).json({message:"Pagamento realizado com sucesso!"})
});

router.post('/processar', pagamentoController.processarPagamento);
router.delete('/cancelar/:pagamentoId', pagamentoController.cancelarPagamento);

module.exports = router;
