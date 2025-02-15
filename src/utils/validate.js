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

const checkingAllowedFields=(req)=>{
    const checkingAllowedFields=['firstName',"lastName","email","age","gender","photoUrl","skills"]
    
   const allowedFields= Object.keys(req).every((key)=>{
      return  checkingAllowedFields.includes(key)
    })

    if(!allowedFields){
        throw new Error("updating profile is not allowed")
    }
}


module.exports={
    singupValidate,
    checkingAllowedFields
}