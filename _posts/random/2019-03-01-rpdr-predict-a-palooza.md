---
layout: post
title: "RuPaul's Drag Race: Predict-a-palooza"
date: 2019-03-01
categories: random
redirect_from: https://www.tmmorin.com/rpdr_predictions.html
---

Last month [Data for Progress launched a prediction competition](https://www.dataforprogress.org/rpdr/2019/2/14/announcing-the-data-for-progress-rupauls-drag-race-machine-learning-competition) that "finally gives data dorks everywhere the chance to show their Charisma, Uniqueness, Nerve, and T...tests." Start your engines, and may the best algorithm win!

![RPDR Season 11](/assets/img/rpdr_season11.jpg)

## In the Workroom: A Naive Bayes Classifier

My team name: "Bayes the House Down." My approach: a Naive Bayes Classifier. Here, I describe a little bit about how my classifier works, and how the algorithm has performed so far.

### The Data

The team over at Data for Progress was generous enough to [provide some excellent datasets](https://shiraamitchell.github.io/rpdr) along with an example algorithm that includes code for scraping the data into R. Datasets include demographic data for every Queen who has ever competed on the show, social media statistics, and every Queen's performance on every single episode from the 10 previous regular seasons.

### The Algorithm

I decided to use a Naive Bayes Classifier (NBC), implemented in R with the package `e1070`. I chose the NBC because it is super easy to implement, even easier to understand, and it runs incredibly fast. I don't have time to go into the math right now, but if you'd like to learn more about what the algorithm is doing, [this blog post offers a great explanation](https://www.r-bloggers.com/understanding-naive-bayes-classifier-using-r/). For predicting the weekly winner and loser of RPDR, I take into consideration the following features:

![Eureka doing math](/assets/img/eureka_math.jpg)

- Age
- Home State
- Past Wins
- Past Losses

To quantify past performance, I gave each queen 1 point if they performed high or won the maxi challenge; -1 point if they performed low, had to lip sync, or were sent home; or 0 points if they were safe. These scores were then averaged. To transform Age and Past Performance from continuous variables into discrete categories, I normalized the values, calculated a percentile, and rounded the percentiles to the nearest tenths place to create ten discrete groups.

Because challenges tend to vary depending on how far the season has progressed (e.g. Snatch Game always falls towards the middle of the season), I decided to train the algorithm only on data from the beginning, middle, or end of a season, as appropriate. Currently, we are still at the beginning of the season, so I'm only training on the first few episodes of each season.

## On the Main Stage: Some Initial Success

Below, I've listed the algorithm's predictions for each Queen for each episode so far. When I run the NBC, I get three probabilities: P(Win), P(Safe), and P(Loss) for each Queen. For my prediction, I choose the Queen with the highest P(Win) as the predicted winner for the week, and the highest P(Loss) as the predicted loser. There are advantages and disadvantages to this, and I plan to write up a blog post later with a more in-depth look at the model's performance, strengths, and weaknesses. Quick humble brag: the algorithm successfully predicted that Brooke Lynn Hytes would win the first episode! Haven't had much luck since, but we'll see...

### Episode 6

**Predicted to Win:** Yvie Oddly &nbsp;&nbsp; **Actual Winner:** *(TBD)*

**Predicted to Lose:** Ra'jah D. O'Hara &nbsp;&nbsp; **Sent Home:** *(TBD)*

| Contestant | P(Win) | P(Safe) | P(Loss) | Actual Performance |
|---|---|---|---|---|
| Nina West | 0.129 | 0.485 | 0.386 | |
| A'keria Chanel Davenport | 0.208 | 0.458 | 0.334 | |
| Ra'jah D. O'Hara | 0.245 | 0.326 | 0.429 | SAFE |
| Scarlet Envy | 0.252 | 0.436 | 0.312 | |
| Plastique Tiara | 0.277 | 0.452 | 0.271 | |
| Silky Nutmeg Ganache | 0.293 | 0.536 | 0.171 | |
| Shuga Cain | 0.295 | 0.432 | 0.273 | |
| Vanessa Vanjie Mateo | 0.402 | 0.390 | 0.209 | |
| Brooke Lynn Hytes | 0.410 | 0.434 | 0.156 | |
| Yvie Oddly | 0.530 | 0.367 | 0.103 | |

### Episode 5: Monster Ball

**Predicted to Win:** Yvie Oddly &nbsp;&nbsp; **Actual Winner:** Brooke Lynn Hytes

**Predicted to Lose:** Shuga Cain &nbsp;&nbsp; **Sent Home:** Ariel Versace

This week's predictions are stunning, darling. Yvie Oddly has been performing consistently well all season and has become a fan favorite. Would love to see her snatch the crown this week. Shuga Cain was previously one of the classifier's top picks, but this week the predictions have her neck and neck with Ra'jah O'Hara for who will be going home. Personally, I would choose Ra'jah, with two lip-syncs in a row, to be going home over Shuga, but I've got to let the algorithm speak for itself!

| Contestant | P(Win) | P(Safe) | P(Loss) | Actual Performance |
|---|---|---|---|---|
| Ra'jah D. O'Hara | 0.133 | 0.562 | 0.341 | SAFE |
| Plastique Tiara | 0.165 | 0.522 | 0.314 | HIGH |
| A'keria Chanel Davenport | 0.168 | 0.518 | 0.314 | SAFE |
| Ariel Versace | 0.169 | 0.752 | 0.0796 | ELIMINATED |
| Nina West | 0.206 | 0.501 | 0.292 | SAFE |
| Silky Nutmeg Ganache | 0.217 | 0.606 | 0.177 | LOW |
| Scarlet Envy | 0.243 | 0.490 | 0.267 | SAFE |
| Shuga Cain | 0.324 | 0.322 | 0.354 | BTM2 |
| Vanessa Vanjie Mateo | 0.383 | 0.518 | 0.099 | SAFE |
| Brooke Lynn Hytes | 0.408 | 0.535 | 0.0567 | WIN |
| Yvie Oddly | 0.0472 | 0.383 | 0.146 | HIGH |

### Episode 4: Trump: The Rusical

**Predicted to Win:** Miss Vaaaaaaanjie (Vanessa Vanjie Mateo) &nbsp;&nbsp; **Actual Winner:** Silky Nutmeg Ganache

**Predicted to Lose:** Nina West &nbsp;&nbsp; **Sent Home:** Mercedes Iman Diamond

Again, Nina West is predicted to lose, which I think is unlikely. Unfortunately her win last week wasn't enough to make the algorithm nicer to her. However, her P(Loss) did decrease by about 10 percentage points. I think the prediction of a win for Vanjie is a good one and I'd like to see her win a challenge!

| Contestant | P(Win) | P(Safe) | P(Loss) | Actual Performance |
|---|---|---|---|---|
| Ra'jah D. O'Hara | 0.116 | 0.605 | 0.279 | BTM2 |
| Ariel Versace | 0.142 | 0.542 | 0.316 | SAFE |
| Nina West | 0.189 | 0.283 | 0.528 | SAFE |
| Shuga Cain | 0.200 | 0.600 | 0.201 | SAFE |
| A'keria Chanel Davenport | 0.231 | 0.390 | 0.379 | SAFE |
| Silky Nutmeg Ganache | 0.255 | 0.466 | 0.279 | WIN |
| Plastique Tiara | 0.261 | 0.511 | 0.228 | SAFE |
| Scarlet Envy | 0.272 | 0.388 | 0.340 | SAFE |
| Mercedes Iman Diamond | 0.298 | 0.334 | 0.368 | ELIMINATED |
| Brooke Lynn Hytes | 0.315 | 0.398 | 0.287 | HIGH |
| Yvie Oddly | 0.317 | 0.359 | 0.325 | HIGH |
| Vanessa Vanjie Mateo | 0.424 | 0.296 | 0.280 | LOW |

### Episode 3: Diva Worship

**Predicted to Win:** Shuga Cain &nbsp;&nbsp; **Actual Winner:** Nina West

**Predicted to Lose:** Nina West &nbsp;&nbsp; **Sent Home:** Honey Davenport

This week's team challenge produced an unprecedented 6-way Lip Sync! The algorithm struggled again this week. I think it's stuck in a rut and over-weighing age. Maybe now that Nina West has been successful, age will be less of a factor.

| Contestant | P(Win) | P(Safe) | P(Loss) | Actual Performance |
|---|---|---|---|---|
| Ariel Versace | 0.162 | 0.740 | 0.0983 | HIGH |
| Silky Nutmeg Ganache | 0.189 | 0.632 | 0.179 | SAFE |
| Nina West | 0.200 | 0.440 | 0.359 | WIN |
| Ra'jah D. O'Hara | 0.227 | 0.606 | 0.167 | BTM6 |
| A'keria Chanel Davenport | 0.281 | 0.536 | 0.183 | BTM6 |
| Mercedes Iman Diamond | 0.311 | 0.489 | 0.201 | SAFE |
| Yvie Oddly | 0.319 | 0.483 | 0.198 | SAFE |
| Plastique Tiara | 0.298 | 0.334 | 0.368 | BTM6 |
| Scarlet Envy | 0.337 | 0.493 | 0.170 | BTM6 |
| Brooke Lynn Hytes | 0.370 | 0.575 | 0.0546 | SAFE |
| Honey Davenport | 0.376 | 0.490 | 0.133 | ELIMINATED |
| Vanessa Vanjie Mateo | 0.435 | 0.458 | 0.107 | HIGH |
| Shuga Cain | 0.233 | 0.300 | 0.468 | BTM6 |

### Episode 2: Good God Girl, Get Out

**Predicted to Win:** Shuga Cain &nbsp;&nbsp; **Actual Winner:** Scarlet Envy & Yvie Oddly

**Predicted to Lose:** Nina West &nbsp;&nbsp; **Sent Home:** Kahanna Montrese

| Contestant | P(Win) | P(Safe) | P(Loss) | Actual Performance |
|---|---|---|---|---|
| Ariel Versace | 0.097 | 0.782 | 0.121 | LOW |
| Nina West | 0.111 | 0.424 | 0.249 | SAFE |
| Kahanna Montrese | 0.17 | 0.581 | 0.249 | ELIMINATED |
| Silky Nutmeg Ganache | 0.206 | 0.602 | 0.192 | SAFE |
| Yvie Oddly | 0.227 | 0.466 | 0.307 | WIN |
| Ra'jah D. O'Hara | 0.267 | 0.625 | 0.109 | SAFE |
| A'keria Chanel Davenport | 0.268 | 0.583 | 0.149 | SAFE |
| Plastique Tiara | 0.278 | 0.584 | 0.138 | HIGH |
| Scarlet Envy | 0.323 | 0.52 | 0.156 | WIN |
| Vanessa Vanjie Mateo | 0.367 | 0.509 | 0.124 | SAFE |
| Brooke Lynn Hytes | 0.395 | 0.549 | 0.0561 | LOW |
| Mercedes Iman Diamond | 0.4 | 0.459 | 0.141 | BTM2 |
| Honey Davenport | 0.405 | 0.489 | 0.105 | SAFE |
| Shuga Cain | 0.445 | 0.347 | 0.208 | HIGH |

### Episode 1: Whatcha Unpackin?

**Predicted to Win:** Brooke Lynn Hytes &nbsp;&nbsp; **Actual Winner:** Brooke Lynn Hytes ✓

**Predicted to Lose:** Nina West &nbsp;&nbsp; **Sent Home:** Soju
