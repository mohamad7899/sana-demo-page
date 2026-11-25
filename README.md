
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#10152e">
    <title>SanaDemo | صفحه آزمایشی</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            min-height: 100vh;
            font-family: Tahoma, sans-serif;
            background: linear-gradient(135deg, #10152e, #29245e, #10152e);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            color: white;
            overflow: hidden;
        }

        .background {
            position: fixed;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
        }

        .circle {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            filter: blur(85px);
            opacity: .55;
            animation: move 8s infinite alternate ease-in-out;
        }

            .circle:nth-child(1) {
                background: #7855ff;
                top: -100px;
                right: -70px;
            }

            .circle:nth-child(2) {
                background: #00c9dc;
                bottom: -100px;
                left: -70px;
                animation-delay: 2s;
            }

        @keyframes move {
            to {
                transform: translate(50px, 40px) scale(1.2);
            }
        }

        .card {
            position: relative;
            width: 100%;
            max-width: 460px;
            padding: 42px 28px;
            text-align: center;
            border: 1px solid rgba(255,255,255,.2);
            border-radius: 28px;
            background: rgba(255,255,255,.09);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            box-shadow: 0 25px 70px rgba(0,0,0,.35);
            animation: entrance 1s ease;
        }

        @keyframes entrance {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo {
            width: 75px;
            height: 75px;
            margin: 0 auto 24px;
            display: grid;
            place-items: center;
            border-radius: 23px;
            font-size: 35px;
            background: linear-gradient(135deg,#7863ff,#00b9d8);
            box-shadow: 0 8px 30px #6255ff66;
        }

        h1 {
            font-size: 30px;
            margin-bottom: 17px;
        }

        .description {
            color: #d5d8ee;
            font-size: 14px;
            line-height: 2.2;
        }

        .button {
            display: block;
            max-width: 300px;
            margin: 28px auto 20px;
            padding: 16px;
            border-radius: 14px;
            background: linear-gradient(100deg,#6959ff,#168fdb);
            color: white;
            text-decoration: none;
            font-size: 14px;
            font-weight: bold;
            transition: .3s;
        }

            .button:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 30px #6255ff66;
            }

        .notice {
            border-top: 1px solid #ffffff25;
            padding-top: 20px;
            margin-top: 25px;
            color: #bdc5e4;
            font-size: 12px;
            line-height: 2.2;
        }

        .footer {
            margin-top: 25px;
            font-size: 11px;
            color: #9da7cb;
        }

        @media(max-width:480px) {
            .card {
                padding: 35px 20px;
            }

            h1 {
                font-size: 25px;
            }
        }

        @media(prefers-reduced-motion:reduce) {
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
            }
        }
    </style>
</head>

<body>

    <div class="background">
        <div class="circle"></div>
        <div class="circle"></div>
    </div>

    <main class="card">

        <div class="logo">✦</div>

        <h1>SanaDemo</h1>

        <p class="description">
            به صفحه آزمایشی ما خوش آمدید.
            <br>
            برای مشاهده سامانه، از لینک رسمی زیر استفاده کنید.
        </p>

        <a class="button"
           href="https://sana.adliran.ir"
           target="_blank"
           rel="noopener noreferrer">
            ورود به سامانه رسمی ثنا ↗
        </a>

        <div class="notice">
            این وب‌سایت یک پروژه مستقل و آزمایشی است
            و متعلق به قوه قضاییه نیست.
            <br>
            هیچ اطلاعات شخصی دریافت یا ذخیره نمی‌شود.
        </div>

        <div class="footer">
            SanaDemo · Independent Demo Project
        </div>

    </main>

</body>
</html>
