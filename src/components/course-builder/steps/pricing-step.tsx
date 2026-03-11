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
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Heart, TagIcon } from 'lucide-react';
import { CourseInitFormData } from '@/lib/service/course';
import { PRICING_TIERS } from '../constant';
import { formatPrice } from '@/lib/utils';
import { useEffect } from 'react';

export function PricingStep() {
    const { control, watch, setValue } = useFormContext<CourseInitFormData>();
    const price = watch('price');
    useEffect(() => {
        setValue('is_free', Number(price) === 0, { shouldValidate: true });
    }, [price, setValue]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <TagIcon className="text-primary h-5 w-5" />
                        Course Price
                    </CardTitle>
                    <CardDescription>
                        Set your course price. Type <strong>0</strong> to make
                        it free.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="text-muted-foreground mb-3 block text-sm">
                            Quick Select
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant={
                                    Number(price) === 0 ? 'default' : 'outline'
                                }
                                className="rounded-xl font-bold"
                                onClick={() =>
                                    setValue('price', 0, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    })
                                }
                            >
                                Free
                            </Button>

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
                                    onClick={() =>
                                        setValue('price', tier.value, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        })
                                    }
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
                                <FormLabel>Custom Price (USD)</FormLabel>
                                <FormControl>
                                    <div className="relative max-w-xs">
                                        <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 font-medium">
                                            $
                                        </span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="1.99"
                                            className="bg-muted/20 h-14 rounded-xl pl-9 text-2xl font-bold shadow-inner"
                                            {...field}
                                            value={
                                                field.value !== undefined
                                                    ? field.value
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === ''
                                                        ? ''
                                                        : Number(
                                                              e.target.value,
                                                          ),
                                                )
                                            }
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Minimum price for a paid course is $1.99
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
            {Number(price) === 0 ? (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <Alert className="rounded-xl border-blue-500/30 bg-blue-500/10 shadow-sm">
                        <Heart className="h-5 w-5 fill-blue-600 text-blue-600" />
                        <AlertTitle className="text-base font-bold text-blue-800">
                            Awesome! You are teaching for free!
                        </AlertTitle>
                        <AlertDescription className="mt-1 text-sm font-medium text-blue-700/80">
                            Sharing knowledge is a noble act. Course Sphere will
                            proudly sponsor 100% of your hosting, bandwidth, and
                            platform fees!
                        </AlertDescription>
                    </Alert>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <Alert className="border-primary/20 bg-primary/5 rounded-xl shadow-sm">
                        <AlertCircle className="text-primary h-4 w-4" />
                        <AlertDescription className="text-sm">
                            <strong>Revenue Share:</strong> You will receive 70%
                            of the course price after platform fees.
                            <span className="border-primary/10 bg-background/80 mt-3 flex items-center justify-between rounded-lg border p-3">
                                <span className="text-muted-foreground font-medium">
                                    Your estimated earnings per sale:
                                </span>
                                <strong className="text-xl font-extrabold text-green-600">
                                    {formatPrice(Number(price) * 0.7)}
                                </strong>
                            </span>
                        </AlertDescription>
                    </Alert>
                </div>
            )}{' '}
        </div>
    );
}
