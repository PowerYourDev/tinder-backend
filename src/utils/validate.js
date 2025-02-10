const Validate=require('validator')

const singupValidate =(req)=>{
    const {firstName,lastName,email,password}=req.body

    if(!firstName || !lastName ){
      throw new Error("firstname and lastname is required")
    }
    if(!Validate.isEmail(email)){
        throw new Error("email is not valid ") 
    }
    
   

}

module.exports={
    singupValidate
}