const UserModel = require("../Schema/User");
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');


const Login = async(req,res)=>
    {
        try{
            let user = await UserModel.findOne({email:req.body.email}).select("-user.password");
            if(user)
            {
                const verifyPassword = await bcrypt.compare(req.body.password,user.password);
        
                if(verifyPassword)
                {
                    const data = {
                        id : user._id,
                        email : user.email,
                        name:user.name,
                        profile_pic : user.profile_pic
                    }
        
                    const token = jwt.sign(
                         data,
                        `${process.env.SECRET_KEY}`,
                         {expiresIn :'1d' }
                    );

                    res.json({success:true,token,user});
                }
                else
                {
                    res.json({success:false,errors:"Wrong Password or email"})
                }
            }
            else
            {
                 res.json({success:false, errors:'Mail not found!!'})
            }
        }
        catch(error)
        {
            return res.status(500).json({
                message : error.message || error || "something went wrong",
                error : true
              })
        }
    }


    module.exports = Login;