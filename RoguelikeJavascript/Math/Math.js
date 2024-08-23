export function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function RatingSuccess(attackRating) {
    return Math.random() < attackRating;
}