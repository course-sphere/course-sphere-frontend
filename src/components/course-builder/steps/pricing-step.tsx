'use client';

import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, Gift, Tag, TrendingUp, AlertCircle } from 'lucide-react';
import { CoursePricingFormData } from '@/lib/service/course';
import { PRICING_TIERS } from '../constant';
import { formatPrice } from '@/lib/utils';

// IMPORTANT: The logic now is Teacher will have 70% of original course, 30% for CourseSphere
export function PricingStep() {
    const { control, watch, setValue, clearErrors } =
        useFormContext<CoursePricingFormData>();

    const isFree = watch('is_free');
    const price = watch('price');
    const discountPrice = watch('discount_price');

    const calculateDiscount = () => {
        const p = Number(price);
        const dp = Number(discountPrice);
        if (!p || !dp || dp >= p) return 0;
        return Math.round(((p - dp) / p) * 100);
    };

    return (
        <div className="space-y-6">
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Pricing Model</CardTitle>
                    <CardDescription>
                        Choose how you want to monetize your course
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField
                        control={control}
                        name="is_free"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(v) => {
                                            const isNowFree = v === 'free';
                                            field.onChange(isNowFree);

                                            if (isNowFree) {
                                                setValue('price', 0, {
                                                    shouldDirty: true,
                                                });
                                                setValue(
                                                    'discount_price',
                                                    undefined,
                                                    { shouldDirty: true },
                                                );
                                                clearErrors([
                                                    'price',
                                                    'discount_price',
                                                ]);
                                            } else {
                                                setValue('price', 19.99, {
                                                    shouldDirty: true,
                                                });
                                            }
                                        }}
                                        value={field.value ? 'free' : 'paid'}
                                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                    >
                                        <Label
                                            htmlFor="free"
                                            className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-5 transition-all ${
                                                field.value
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                        >
                                            <RadioGroupItem
                                                value="free"
                                                id="free"
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <Gift
                                                        className={`h-5 w-5 ${field.value ? 'text-primary' : 'text-muted-foreground'}`}
                                                    />
                                                    <span
                                                        className={`font-semibold ${field.value ? 'text-primary' : 'text-foreground'}`}
                                                    >
                                                        Free Course
                                                    </span>
                                                </div>
                                                <p className="text-muted-foreground text-sm">
                                                    Make your course freely
                                                    available to all students
                                                </p>
                                            </div>
                                        </Label>

                                        <Label
                                            htmlFor="paid"
                                            className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-5 transition-all ${
                                                !field.value
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                        >
                                            <RadioGroupItem
                                                value="paid"
                                                id="paid"
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <DollarSign
                                                        className={`h-5 w-5 ${!field.value ? 'text-primary' : 'text-muted-foreground'}`}
                                                    />
                                                    <span
                                                        className={`font-semibold ${!field.value ? 'text-primary' : 'text-foreground'}`}
                                                    >
                                                        Paid Course
                                                    </span>
                                                </div>
                                                <p className="text-muted-foreground text-sm">
                                                    Set a price and earn money
                                                    from your course
                                                </p>
                                            </div>
                                        </Label>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {!isFree && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-6 duration-300">
                    <Card className="border-border rounded-2xl shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Tag className="text-primary h-5 w-5" />
                                Course Price
                            </CardTitle>
                            <CardDescription>
                                Set your course price. We recommend pricing
                                based on course length and value.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="text-muted-foreground mb-3 block text-sm">
                                    Quick Select
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {PRICING_TIERS.map((tier) => (
                                        <Button
                                            key={tier.value}
                                            type="button"
                                            variant={
                                                Number(price) === tier.value
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="rounded-xl"
                                            onClick={() => {
                                                setValue('price', tier.value, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });
                                            }}
                                        >
                                            {tier.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <FormField
                                control={control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Custom Price (USD)
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 font-medium">
                                                    $
                                                </span>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="9.99"
                                                    className="h-12 rounded-xl pl-9 text-lg font-semibold"
                                                    {...field}
                                                    value={field.value || ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target.value;
                                                        field.onChange(
                                                            val === ''
                                                                ? ''
                                                                : Number(val),
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Minimum price is $9.99
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border rounded-2xl shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="text-primary h-5 w-5" />
                                Promotional Discount (Optional)
                            </CardTitle>
                            <CardDescription>
                                Offer a discounted price to attract more
                                students
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={control}
                                name="discount_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Discounted Price (USD)
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 font-medium">
                                                    $
                                                </span>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Leave empty for no discount"
                                                    className="h-12 rounded-xl pl-9 text-lg"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target.value;
                                                        field.onChange(
                                                            val === ''
                                                                ? undefined
                                                                : Number(val),
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {Boolean(discountPrice) &&
                                Number(discountPrice) < Number(price) && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 flex items-center gap-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 font-bold text-white">
                                            -{calculateDiscount()}%
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">
                                                Students will see:
                                            </p>
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <span className="text-lg font-bold text-green-600">
                                                    {formatPrice(
                                                        Number(discountPrice),
                                                    )}
                                                </span>
                                                <span className="text-muted-foreground text-sm line-through">
                                                    {formatPrice(Number(price))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    <Alert className="border-primary/20 bg-primary/5 rounded-xl">
                        <AlertCircle className="text-primary h-4 w-4" />
                        <AlertDescription className="text-sm">
                            <strong>Revenue Share:</strong> You will receive 70%
                            of the course price after platform fees.
                            {Number(price) > 0 && (
                                <span className="border-primary/10 mt-2 block rounded-lg border bg-white/50 p-3">
                                    Your earnings per sale:{' '}
                                    <strong className="text-primary ml-1 text-base">
                                        {formatPrice(
                                            Number(discountPrice || price) *
                                                0.7,
                                        )}
                                    </strong>
                                </span>
                            )}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}
