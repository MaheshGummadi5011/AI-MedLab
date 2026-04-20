import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import cartContext from '../../contexts/cart/cartContext';
import useActive from '../../hooks/useActive';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';


const ProductCard = (props) => {

    const { id, images, title, price } = props;

    const { addItem, placeOrder } = useContext(cartContext);
    const { active, handleActive, activeClass } = useActive(false);
    const navigate = useNavigate();
    const [balance, setBalance] = React.useState(0);

    // Add useEffect to fetch wallet balance
    React.useEffect(() => {
        httpClient.post("/get_wallet", { email: localStorage.getItem("email") })
            .then((res) => {
                setBalance(Number(res.data.wallet));
            });
    }, []);

    // handling Add-to-cart
    const handleAddItem = () => {
        const item = { ...props };
        addItem(item);

        handleActive(id);

        setTimeout(() => {
            handleActive(false);
        }, 3000);
    };

    // Handling direct purchase
    const handleDirectPurchase = () => {
        const order = { ...props, quantity: 1 };
        
        if (price <= balance) {
            // If wallet has enough balance, use wallet
            httpClient.post("/debit_wallet", {
                email: localStorage.getItem("email"),
                walletAmount: price,
            }).then(() => {
                localStorage.setItem("orders", JSON.stringify([order]));
                window.location.href = "https://ai-medlab-server.vercel.app/success";
            });
        } else {
            // If wallet doesn't have enough balance, go to checkout
            localStorage.setItem("totalPrice", price);
            localStorage.setItem("orders", JSON.stringify([order]));
            navigate("/checkout");
        }
    };

    return (
        <>
        {/* products_card */}
            <div className="card w-[24%] max-xs:w-[98%] max-md:w-[46%] max-lg:w-[31%] border-[1px] border-white-1/40 overflow-auto max-h-[520px] shadow-[0px_0px_5px_2px_#ccc] rounded-[8px] text-blue-6 text-center transition-all duration-300 ease-in-out hover:shadow-[0px_0px_10px_2px_#7584AE] hover:text-blue-8 scrollbar-none mb-3 dark:text-white-1" >
            {/* products_img */}
                <figure className="p-4 overflow-hidden min-h-[50%]">
                    <Link to={`/all-medicines/medicine-details/${id}`} className='flex justify-center w-full'>
                        <img src={images[0]} alt="product-img" className='w-[70%] transition-transform duration-200 ease hover:transform hover:scale-[1.05]'/>
                    </Link>
                </figure>
                {/* products_details */}
                <div className="p-4">
                    {/* products_title */}
                    <h3 className="mt-[0.8rem] mb-[0.4rem]">
                        <Link to={`/all-medicines/medicine-details/${id}`}>{title}</Link>
                    </h3>
                    {/* <h5 className="products_info">{info}</h5> */}
                    {/* separator */}
                    <div className="mt-4 mb-4 border-t-[1px] border-t-grey-2"></div>
                    {/* products_price */}
                    <h2 className="">
                        ₹ {price} /- &nbsp;
                    </h2> 

                    {/* Add flex container for buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-[1.2rem]">
                        <button
                            type="button"
                            className="flex-1 bg-orange-1 text-white-1 px-[0.8rem] py-3 rounded-[3px] transition-colors duration-200 ease-out hover:bg-orange-2 active:bg-blue-7 dark:bg-orange-600 dark:hover:bg-orange-1"
                            onClick={() => {
                                localStorage.setItem("totalPrice", price);
                                const order = { ...props, quantity: 1 };
                                placeOrder(order);
                                navigate("/checkout");
                            }}
                        >
                            Buy now
                        </button>
                        <button
                            type="button"
                            className={`flex-1 bg-orange-1 text-white-1 px-[0.8rem] py-3 rounded-[3px] transition-colors duration-200 ease-out hover:bg-orange-2 ${activeClass(id)} bg-yellow-4 hover:bg-yellow-6 dark:bg-yellow-500 dark:hover:bg-yellow-4`}
                            onClick={handleAddItem}
                        >
                            {active ? 'Added' : 'Add to cart'}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProductCard;