// import express from 'express'
// import cookieParser from 'cookie-parser'
// import cors from 'cors'
// import connectDB from './configs/db.js';
// import 'dotenv/config'
// import userRouter from './routes/userRoute.js';
// import sellerRouter from './routes/sellerRoute.js';
// import connectCloudinary from './configs/cloudinary.js';
// import productRouter from './routes/productRoute.js';
// import cartRouter from './routes/cartRoute.js';
// import addressRouter from './routes/addressRoute.js';
// import orderRouter from './routes/orderRoute.js';
// const app = express()
// const port = process.env.PORT || 4000;

// await connectDB()
// await connectCloudinary()

// //Allow multiple origins
// // const allowedOrigins = [
// //   'http://localhost:5173',
// //   'https://grocery-delivery-91k6.vercel.app'
// // ]



// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://grocery-delivery-91k6.vercel.app'
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true); // allow Postman / no-origin requests
//     if (
//       allowedOrigins.includes(origin) ||
//       origin.match(/^https:\/\/grocery-delivery-91k6-.*\.vercel\.app$/)
//     ) {
//       return callback(null, true);
//     }
//     return callback(new Error(`CORS blocked for origin ${origin}`), false);
//   },
//   credentials: true,
// }));

// // Handle preflight requests (OPTIONS) for all routes
// app.options('*', cors({
//   origin: allowedOrigins,
//   credentials: true
// }));


// //Middleware configuration
// app.use(express.json())
// app.use(cookieParser())
// // app.use(cors({origin: allowedOrigins, credentials:true}))

// app.get('/',(req,res) =>res.send("API is Working"))
// app.use('/api/user',userRouter)
// app.use('/api/seller',sellerRouter)
// app.use('/api/product',productRouter)
// app.use('/api/cart',cartRouter)
// app.use('/api/address',addressRouter)
// app.use('/api/order',orderRouter)

// app.listen(port,()=>{
//     console.log(`Server is running on http://localhost:${port}`);
    
// })



import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect DB and Cloudinary
await connectDB();
await connectCloudinary();

// Allow multiple origins including all Vercel preview URLs
const allowedOrigins = [
  'http://localhost:5173', // local dev
  'https://grocery-delivery-91k6.vercel.app' // production
];

// Dynamic origin function
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/grocery-delivery-91k6-.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS blocked for origin ${origin}`), false);
    }
  },
  credentials: true,
};

// Apply to all routes
app.use(cors(corsOptions));

// Preflight handling for all routes dynamically
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});