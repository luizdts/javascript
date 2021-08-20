import User from '../models/User'
import * as Yup from 'yup';

class SessionController{

   async store(req,res){ // aplicação assincrona
        const schema = Yup.object().shape({
            email: Yup.string().email().required(), // validação de email
        });

        const {email} = req.body;

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Falha na validação."})
        }
        
        let user = await User.findOne({ email }) // busca um único email

        if(!user){ // checagem de existencia
            user = await User.create({ email }); // criação de usuário em caso negativo de checagem
        }

        return res.json({user});
    }


}

export default new SessionController;



// métodos de controle

/*
index: listagem das sessões
store: inicia uma sessão
show: lista uma única sessão
update: atualiza alguma das sessões
destroy: deleta uma sessão
*/