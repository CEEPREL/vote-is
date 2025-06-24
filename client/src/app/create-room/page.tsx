'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';

const schema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(5, 'Description is required'),
  options: z
    .array(z.string().min(1, 'Each option must not be empty'))
    .min(2, 'At least two options are required')
    .max(5, 'No more than five options allowed'),
  votingDeadline: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'Deadline must be in the future',
  }),
});

type FormData = z.infer<typeof schema>;

export default function CreateRoomPage() {
  const router = useRouter();
  const { token } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      options: ['', ''],
      votingDeadline: '',
    },
  });

  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: 'options',
  });

  const onSubmit = async (data: FormData) => {
    const cleanedData = {
      ...data,
      options: data.options.filter((opt) => opt.trim() !== ''),
    };

    if (cleanedData.options.length < 2) {
      alert('At least two valid options are required.');
      return;
    }

    try {
      const res = await fetch(`/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(cleanedData),
      });

      if (!res.ok) throw new Error('Failed to create room');
      const result = await res.json();

      alert('Room created successfully!');
      router.push(`/dashboard?new=${result.slug}`);
    } catch (err) {
      alert('Error creating room. Please try again.');
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen relative bg-black flex justify-center px-4 py-10">
      <div className="bg-black shadow-lg shadow-gray-500 rounded-xl w-full max-w-xl p-6 space-y-4">
        <div className="flex gap-5">
          <button
            className="text-green-700 cursor-pointer"
            onClick={() => router.push('/dashboard')}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <h1 className="text-xl font-bold text-green-700">Create Room</h1>

          <div>
            <input
              {...register('title')}
              placeholder="Title"
              className="w-full px-3 py-2 border bg-gray-700 border-green-900 text-gray-400 rounded"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <textarea
              {...register('description')}
              placeholder="Description"
              className="w-full px-3 py-2 text-gray-400 bg-gray-700 border-2 border-green-900 rounded"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-green-700">Options</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <input
                  {...register(`options.${index}`)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 text-gray-400 bg-gray-700 border-green-900 px-3 py-2 border rounded"
                />
                {fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {fields.length < 5 && (
              <button
                type="button"
                onClick={() => append('')}
                className="text-sm text-green-600 hover:underline"
              >
                + Click here to add Option
              </button>
            )}

            {errors.options?.message && (
              <p className="text-red-500 text-sm">{errors.options.message}</p>
            )}
          </div>

          <div>
            <input
              type="datetime-local"
              {...register('votingDeadline')}
              className="w-full px-3 py-2 text-green-600 bg-gray-700 border-green-900 border-2 rounded"
            />
            {errors.votingDeadline && (
              <p className="text-red-500 text-sm">
                {errors.votingDeadline.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
          >
            Create Room
          </button>
        </form>
      </div>
    </main>
  );
}
