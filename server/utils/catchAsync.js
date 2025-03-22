const catchAsyncErrorHandler = (func) =>{
    return (req, res, next)=>{
        func(req, res, next).catch(next)
    }
}
export default catchAsyncErrorHandler;
//module.exports = catchAsyncErrorHandler;