import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../api/Suppliers';
import { signIn } from '../features/UserSlice';
import { useNavigate } from 'react-router-dom';

import '../sass/login_signUp.scss';

function Login() {
    let disp = useDispatch();
    const nav = useNavigate();

    function loginUser(data) {
        login(data).then(res => {
            disp(signIn(res.data));
            nav('/orders')
        }).catch(err => {
            alert(err.response?.data?.message)
            console.log(err.response);
        });
    }

    let { register, formState: { errors }, handleSubmit } = useForm();
    return (
        <form onSubmit={handleSubmit(loginUser)} className="login-form">
            <h1>Login</h1>

            <div className="input-group">
                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                        required: { value: true, message: "Password is required" },
                        minLength: { value: 6, message: "Password must be at least 6 characters long" }
                    })}
                />
                {errors.password && <p>{errors.password.message}</p>}
            </div>

            <div className="input-group">
                <input
                    type="text"
                    placeholder="Phone"
                    {...register("phone", {
                        required: { value: true, message: "Phone number is required" },
                        pattern: {
                            value: /^\d{9,10}$/,
                            message: "Phone number must be 9 or 10 digits"
                        }
                    })}
                />
                {errors.phone && <p>{errors.phone.message}</p>}
            </div>

            <button type="submit" className="submit-btn">Login</button>
        </form>
    );
}

export default Login;
